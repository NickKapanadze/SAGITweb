export const formatPartyCode = (code: string): string => {
  return code.replace(/(.{3})/g, '$1 ').trim();
};

export const getTeamColor = (team: string): string => {
  const colors: Record<string, string> = {
    CITIZEN: 'bg-blue-600',
    MAFIA: 'bg-red-600',
    SOLO: 'bg-yellow-600',
  };
  return colors[team] || 'bg-gray-600';
};

export const getTeamTextColor = (team: string): string => {
  const colors: Record<string, string> = {
    CITIZEN: 'text-blue-600',
    MAFIA: 'text-red-600',
    SOLO: 'text-yellow-600',
  };
  return colors[team] || 'text-gray-600';
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isNightPhase = (state: string): boolean => {
  return state.startsWith('NIGHT_');
};

export const isDayPhase = (state: string): boolean => {
  return state.startsWith('DAY_');
};

export const canVoteInPhase = (state: string): boolean => {
  return state === 'DAY_VOTING';
};

export const canPerformNightAction = (state: string, roleName: string): boolean => {
  const phaseRoleMap: Record<string, string[]> = {
    NIGHT_MAFIA: ['Mafia', 'Don Mafia'],
    NIGHT_SERIAL: ['Serial Killer'],
    NIGHT_DOCTOR: ['Doctor'],
    NIGHT_DETECTIVE: ['Detective', 'Don Mafia'],
  };

  return phaseRoleMap[state]?.includes(roleName) || false;
};
