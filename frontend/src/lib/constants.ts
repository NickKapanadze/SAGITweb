export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

export const DEFAULT_MAX_PLAYERS = 12;

export const PHASE_NAMES: Record<string, string> = {
  LOBBY: 'Lobby',
  WAITING_FOR_PLAYERS: 'Waiting for Players',
  DAY_DISCUSSION: 'Day - Discussion',
  DAY_SPEECHES: 'Day - Final Speeches',
  DAY_VOTING: 'Day - Voting',
  VOTE_RESULTS: 'Vote Results',
  NIGHT_MAFIA: 'Night - Mafia',
  NIGHT_SERIAL: 'Night - Serial Killer',
  NIGHT_DOCTOR: 'Night - Doctor',
  NIGHT_DETECTIVE: 'Night - Detective',
  NIGHT_RESOLUTION: 'Night - Resolution',
  GAME_END: 'Game Over',
};

export const TEAM_COLORS = {
  CITIZEN: {
    light: '#3b82f6',
    DEFAULT: '#1e40af',
    dark: '#1e3a8a',
  },
  MAFIA: {
    light: '#dc2626',
    DEFAULT: '#991b1b',
    dark: '#7f1d1d',
  },
  SOLO: {
    light: '#eab308',
    DEFAULT: '#a16207',
    dark: '#713f12',
  },
};
