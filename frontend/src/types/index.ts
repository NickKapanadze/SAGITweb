export enum GameState {
  LOBBY = 'LOBBY',
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  DAY_DISCUSSION = 'DAY_DISCUSSION',
  DAY_SPEECHES = 'DAY_SPEECHES',
  DAY_VOTING = 'DAY_VOTING',
  VOTE_RESULTS = 'VOTE_RESULTS',
  NIGHT_MAFIA = 'NIGHT_MAFIA',
  NIGHT_SERIAL = 'NIGHT_SERIAL',
  NIGHT_DOCTOR = 'NIGHT_DOCTOR',
  NIGHT_DETECTIVE = 'NIGHT_DETECTIVE',
  NIGHT_RESOLUTION = 'NIGHT_RESOLUTION',
  GAME_END = 'GAME_END',
}

export enum Team {
  CITIZEN = 'CITIZEN',
  MAFIA = 'MAFIA',
  SOLO = 'SOLO',
}

export enum VotingMode {
  ANONYMOUS = 'ANONYMOUS',
  VISIBLE = 'VISIBLE',
}

export enum ActionType {
  KILL = 'KILL',
  HEAL = 'HEAL',
  CHECK = 'CHECK',
}

export enum ClientType {
  TV = 'TV',
  HOST = 'HOST',
  PLAYER = 'PLAYER',
}

export interface Player {
  id: string;
  slotNumber: number;
  nickname: string;
  isAlive: boolean;
  hasVoteRights: boolean;
  isConnected: boolean;
  role?: Role;
}

export interface Role {
  id: string;
  name: string;
  team: Team;
  abilities: {
    kill?: {
      enabled: boolean;
      limit?: number;
    };
    heal?: {
      enabled: boolean;
      limitPerPlayer?: number;
      totalLimit?: number;
    };
    check?: {
      enabled: boolean;
      canCheckSameTwice?: boolean;
    };
  };
  canVote: boolean;
  nightOrder: number;
  description?: string;
  knowsTeamMembers: boolean;
}

export interface Session {
  id: string;
  partyCode: string;
  state: GameState;
  currentDay: number;
  currentSpeaker: number;
  speakingOrder: number[];
  config: SessionConfig;
  players: Player[];
  fouls: Foul[];
}

export interface SessionConfig {
  maxPlayers: number;
  timers: {
    discussion: number;
    speeches: number;
    voting: number;
    nightPhase: number;
  };
  roleCounts: {
    [roleName: string]: number;
  };
  abilityLimits: {
    doctorHealsPerPlayer?: number;
    doctorTotalHeals?: number;
    serialKillerTotalKills?: number;
  };
  votingMode: VotingMode;
  allowMidGameJoin: boolean;
  autoKickFouls: number;
  canMafiaTargetMafia: boolean;
}

export interface Foul {
  id: string;
  playerId: string;
  reason?: string;
  timestamp: Date;
}

export interface Vote {
  voterId: string;
  voterName?: string;
  targetId?: string;
  targetName?: string;
}
