import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, Player } from '../../entities';
import { GameState, VotingMode } from '../../enums';
import { v4 as uuidv4 } from 'uuid';
import { randomInt } from 'crypto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  async createSession(): Promise<Session> {
    const partyCode = this.generatePartyCode();
    const hostToken = uuidv4();

    const session = this.sessionRepository.create({
      partyCode,
      hostToken,
      state: GameState.LOBBY,
      config: {
        maxPlayers: 12,
        timers: {
          discussion: 300,
          speeches: 60,
          voting: 60,
          nightPhase: 60,
        },
        roleCounts: {
          Citizen: 0,
          Mafia: 0,
          'Don Mafia': 0,
          Detective: 0,
          Doctor: 0,
          'Serial Killer': 0,
        },
        abilityLimits: {
          doctorHealsPerPlayer: 1,
          serialKillerTotalKills: 3,
        },
        votingMode: VotingMode.ANONYMOUS,
        allowMidGameJoin: false,
        autoKickFouls: 0,
        canMafiaTargetMafia: false,
      },
      currentDay: 1,
      currentSpeaker: 0,
      speakingOrder: [],
    });

    return this.sessionRepository.save(session);
  }

  async findByPartyCode(partyCode: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { partyCode },
      relations: ['players', 'players.role'],
    });
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { id },
      relations: ['players', 'players.role'],
    });
  }

  async addPlayer(sessionId: string, slotNumber: number, nickname: string): Promise<Player> {
    const reconnectToken = uuidv4();

    const player = this.playerRepository.create({
      sessionId,
      slotNumber,
      nickname,
      reconnectToken,
      isAlive: true,
      hasVoteRights: true,
      isConnected: true,
      nightActionHistory: [],
    });

    return this.playerRepository.save(player);
  }

  async findPlayerByReconnectToken(token: string): Promise<Player | null> {
    return this.playerRepository.findOne({
      where: { reconnectToken: token },
      relations: ['session', 'role'],
    });
  }

  async updatePlayerConnection(playerId: string, isConnected: boolean): Promise<void> {
    await this.playerRepository.update(playerId, {
      isConnected,
      lastSeen: new Date(),
    });
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<void> {
    await this.sessionRepository.update(id, updates);
  }

  private generatePartyCode(): string {
    const randomNum = randomInt(100000, 1000000);
    return randomNum.toString();
  }

  async validateHostToken(partyCode: string, hostToken: string): Promise<boolean> {
    const session = await this.sessionRepository.findOne({
      where: { partyCode },
    });

    return session?.hostToken === hostToken;
  }

  async getSessionState(sessionId: string): Promise<any> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['players', 'players.role', 'fouls'],
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      partyCode: session.partyCode,
      state: session.state,
      currentDay: session.currentDay,
      currentSpeaker: session.currentSpeaker,
      speakingOrder: session.speakingOrder,
      config: session.config,
      players: session.players.map(p => ({
        id: p.id,
        slotNumber: p.slotNumber,
        nickname: p.nickname,
        isAlive: p.isAlive,
        hasVoteRights: p.hasVoteRights,
        isConnected: p.isConnected,
        // Role is only included for the specific player
      })),
      fouls: session.fouls,
    };
  }
}
