import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, Player, Role, Vote, NightAction, Foul } from '../../entities';
import { GameState, Team, ActionType, VotingMode } from '../../enums';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
    @InjectRepository(NightAction)
    private nightActionRepository: Repository<NightAction>,
    @InjectRepository(Foul)
    private foulRepository: Repository<Foul>,
  ) {}

  async startGame(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['players'],
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Assign roles to players based on config
    await this.assignRoles(session);

    // Set initial speaking order
    const alivePlayers = session.players.filter(p => p.isAlive);
    session.speakingOrder = alivePlayers.map(p => p.slotNumber);
    session.currentSpeaker = 0;
    session.state = GameState.DAY_DISCUSSION;
    session.phaseStartTime = new Date();

    await this.sessionRepository.save(session);
  }

  private async assignRoles(session: Session): Promise<void> {
    const roleCounts = session.config.roleCounts;
    const players = session.players;

    const roleAssignments: string[] = [];

    // Build role assignment array
    for (const [roleName, count] of Object.entries(roleCounts)) {
      for (let i = 0; i < count; i++) {
        roleAssignments.push(roleName);
      }
    }

    // Shuffle role assignments
    for (let i = roleAssignments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roleAssignments[i], roleAssignments[j]] = [roleAssignments[j], roleAssignments[i]];
    }

    // Assign roles to players
    for (let i = 0; i < players.length && i < roleAssignments.length; i++) {
      const roleName = roleAssignments[i];
      const role = await this.roleRepository.findOne({ where: { name: roleName } });

      if (role) {
        players[i].roleId = role.id;
        await this.playerRepository.save(players[i]);
      }
    }
  }

  async transitionToNextPhase(sessionId: string): Promise<GameState> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['players', 'players.role'],
    });

    if (!session) {
      throw new Error('Session not found');
    }

    const currentState = session.state;
    let nextState: GameState;

    switch (currentState) {
      case GameState.LOBBY:
      case GameState.WAITING_FOR_PLAYERS:
        nextState = GameState.DAY_DISCUSSION;
        break;
      
      case GameState.DAY_DISCUSSION:
        nextState = GameState.DAY_SPEECHES;
        session.currentSpeaker = 0;
        break;
      
      case GameState.DAY_SPEECHES:
        nextState = GameState.DAY_VOTING;
        break;
      
      case GameState.DAY_VOTING:
        await this.resolveVoting(session);
        nextState = GameState.VOTE_RESULTS;
        break;
      
      case GameState.VOTE_RESULTS:
        const winner = await this.checkWinCondition(session);
        if (winner) {
          nextState = GameState.GAME_END;
        } else {
          nextState = GameState.NIGHT_MAFIA;
          session.currentDay += 1;
        }
        break;
      
      case GameState.NIGHT_MAFIA:
        nextState = GameState.NIGHT_SERIAL;
        break;
      
      case GameState.NIGHT_SERIAL:
        nextState = GameState.NIGHT_DOCTOR;
        break;
      
      case GameState.NIGHT_DOCTOR:
        nextState = GameState.NIGHT_DETECTIVE;
        break;
      
      case GameState.NIGHT_DETECTIVE:
        nextState = GameState.NIGHT_RESOLUTION;
        break;
      
      case GameState.NIGHT_RESOLUTION:
        await this.resolveNightActions(session);
        const nightWinner = await this.checkWinCondition(session);
        if (nightWinner) {
          nextState = GameState.GAME_END;
        } else {
          nextState = GameState.DAY_DISCUSSION;
          // Update speaking order for alive players
          const alivePlayers = session.players.filter(p => p.isAlive);
          session.speakingOrder = alivePlayers.map(p => p.slotNumber);
          session.currentSpeaker = 0;
        }
        break;
      
      case GameState.GAME_END:
        nextState = GameState.LOBBY;
        break;
      
      default:
        nextState = currentState;
    }

    session.state = nextState;
    session.phaseStartTime = new Date();
    await this.sessionRepository.save(session);

    return nextState;
  }

  private async resolveVoting(session: Session): Promise<void> {
    const phaseId = `${session.id}-day-${session.currentDay}-vote`;
    const votes = await this.voteRepository.find({
      where: { sessionId: session.id, phaseId },
    });

    // Count votes
    const voteCounts: { [targetId: string]: number } = {};
    votes.forEach(vote => {
      if (vote.targetId) {
        voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
      }
    });

    // Find player with most votes
    let maxVotes = 0;
    let eliminatedPlayerId: string | null = null;
    let isTie = false;

    for (const [targetId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedPlayerId = targetId;
        isTie = false;
      } else if (count === maxVotes && count > 0) {
        isTie = true;
      }
    }

    // Eliminate player if not a tie
    if (eliminatedPlayerId && !isTie) {
      await this.playerRepository.update(eliminatedPlayerId, { isAlive: false });
    }
  }

  private async resolveNightActions(session: Session): Promise<void> {
    const actions = await this.nightActionRepository.find({
      where: { sessionId: session.id, day: session.currentDay, resolved: false },
      relations: ['actor', 'target', 'actor.role'],
    });

    const killTargets = new Set<string>();
    const healTargets = new Set<string>();

    // Process actions in order
    actions.forEach(action => {
      switch (action.actionType) {
        case ActionType.KILL:
          if (action.targetId) {
            killTargets.add(action.targetId);
          }
          break;
        case ActionType.HEAL:
          if (action.targetId) {
            healTargets.add(action.targetId);
          }
          break;
      }
    });

    // Remove healed players from kill list
    healTargets.forEach(targetId => {
      killTargets.delete(targetId);
    });

    // Kill remaining targets
    for (const targetId of killTargets) {
      await this.playerRepository.update(targetId, { isAlive: false });
    }

    // Mark all actions as resolved
    for (const action of actions) {
      action.resolved = true;
      await this.nightActionRepository.save(action);
    }
  }

  async checkWinCondition(session: Session): Promise<Team | null> {
    const alivePlayers = session.players.filter(p => p.isAlive);
    
    const citizenCount = alivePlayers.filter(p => p.role?.team === Team.CITIZEN).length;
    const mafiaCount = alivePlayers.filter(p => p.role?.team === Team.MAFIA).length;
    const serialKillerCount = alivePlayers.filter(p => p.role?.team === Team.SOLO).length;

    // Serial Killer wins if alone
    if (serialKillerCount === 1 && alivePlayers.length === 1) {
      return Team.SOLO;
    }

    // Mafia wins if equal or greater than citizens and no serial killer
    if (mafiaCount >= citizenCount && serialKillerCount === 0) {
      return Team.MAFIA;
    }

    // Citizens win if all mafia and serial killers eliminated
    if (mafiaCount === 0 && serialKillerCount === 0) {
      return Team.CITIZEN;
    }

    return null;
  }

  async submitVote(playerId: string, targetId: string | null, sessionId: string, day: number): Promise<void> {
    const phaseId = `${sessionId}-day-${day}-vote`;
    
    // Delete existing vote for this phase
    await this.voteRepository.delete({ voterId: playerId, phaseId });

    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    
    // Create new vote
    const vote = this.voteRepository.create({
      sessionId,
      phaseId,
      voterId: playerId,
      targetId,
      visibilityMode: session?.config.votingMode || VotingMode.ANONYMOUS,
    });

    await this.voteRepository.save(vote);
  }

  async submitNightAction(
    playerId: string,
    actionType: ActionType,
    targetId: string | null,
    sessionId: string,
    day: number,
  ): Promise<void> {
    // Validate action based on player's role
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ['role'],
    });

    if (!player || !player.role) {
      throw new Error('Player or role not found');
    }

    // Check if player can perform this action
    const abilities = player.role.abilities;
    if (actionType === ActionType.KILL && !abilities.kill?.enabled) {
      throw new Error('Player cannot perform kill action');
    }
    if (actionType === ActionType.HEAL && !abilities.heal?.enabled) {
      throw new Error('Player cannot perform heal action');
    }
    if (actionType === ActionType.CHECK && !abilities.check?.enabled) {
      throw new Error('Player cannot perform check action');
    }

    // Delete existing action for this night
    await this.nightActionRepository.delete({ actorId: playerId, day, resolved: false });

    // Create new action
    const action = this.nightActionRepository.create({
      sessionId,
      actorId: playerId,
      actionType,
      targetId,
      day,
      resolved: false,
    });

    await this.nightActionRepository.save(action);
  }

  async assignFoul(sessionId: string, playerId: string, reason?: string): Promise<void> {
    const foul = this.foulRepository.create({
      sessionId,
      playerId,
      reason,
    });

    await this.foulRepository.save(foul);

    // Check auto-kick threshold
    const session = await this.sessionRepository.findOne({ where: { id: sessionId } });
    if (session && session.config.autoKickFouls > 0) {
      const foulCount = await this.foulRepository.count({ where: { playerId } });
      
      if (foulCount >= session.config.autoKickFouls) {
        await this.playerRepository.update(playerId, { isAlive: false, hasVoteRights: false });
      }
    }
  }

  async getVotes(sessionId: string, day: number): Promise<Vote[]> {
    const phaseId = `${sessionId}-day-${day}-vote`;
    return this.voteRepository.find({
      where: { sessionId, phaseId },
      relations: ['voter', 'target'],
    });
  }
}
