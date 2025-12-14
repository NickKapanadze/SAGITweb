import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Session, Player, Role, GameState, ClientType, Team } from '@/types';

export default function PlayerView() {
  const router = useRouter();
  const { playerId } = router.query;
  const [session, setSession] = useState<Session | null>(null);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [myRole, setMyRole] = useState<Role | null>(null);
  const [selectedVoteTarget, setSelectedVoteTarget] = useState<string | null>(null);
  const [selectedNightTarget, setSelectedNightTarget] = useState<string | null>(null);
  const { isConnected, emit, on, off } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

  useEffect(() => {
    if (!playerId || !isConnected) return;

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Join session as player
    emit('JOIN_SESSION', {
      sessionId,
      clientType: ClientType.PLAYER,
      playerId,
    });

    // Listen for events
    const handleStateUpdate = (data: Session) => {
      setSession(data);
      const player = data.players.find(p => p.id === playerId);
      setMyPlayer(player || null);
    };

    const handleRoleAssigned = (data: { role: Role }) => {
      setMyRole(data.role);
    };

    on('SESSION_STATE_UPDATE', handleStateUpdate);
    on('ROLE_ASSIGNED', handleRoleAssigned);

    return () => {
      off('SESSION_STATE_UPDATE', handleStateUpdate);
      off('ROLE_ASSIGNED', handleRoleAssigned);
    };
  }, [playerId, isConnected]);

  const handleSubmitVote = () => {
    if (!session) return;
    
    emit('SUBMIT_VOTE', {
      targetId: selectedVoteTarget,
    });
    
    alert('Vote submitted!');
  };

  const handleSubmitNightAction = (actionType: string) => {
    if (!session) return;
    
    emit('SUBMIT_NIGHT_ACTION', {
      actionType,
      targetId: selectedNightTarget,
    });
    
    setSelectedNightTarget(null);
    alert('Night action submitted!');
  };

  if (!session || !myPlayer) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  const alivePlayers = session.players.filter(p => p.isAlive && p.id !== myPlayer.id);

  return (
    <>
      <Head>
        <title>Player View - Mafia Game</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-200 text-sm">Welcome</p>
              <p className="text-xl font-bold text-white">{myPlayer.nickname}</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-sm">Status</p>
              <p className="text-lg font-bold text-white">
                {myPlayer.isAlive ? '✅ Alive' : '💀 Dead'}
              </p>
            </div>
          </div>
        </div>

        {/* Role Card */}
        {myRole && (
          <div className={`
            bg-gradient-to-br rounded-xl p-6 mb-4 border-2 shadow-xl
            ${myRole.team === Team.CITIZEN ? 'from-blue-600 to-blue-800 border-blue-400' : ''}
            ${myRole.team === Team.MAFIA ? 'from-red-600 to-red-800 border-red-400' : ''}
            ${myRole.team === Team.SOLO ? 'from-yellow-600 to-yellow-800 border-yellow-400' : ''}
          `}>
            <div className="text-center text-white">
              <p className="text-sm opacity-80 mb-1">Your Role</p>
              <h2 className="text-3xl font-bold mb-2">{myRole.name}</h2>
              <p className="text-sm opacity-90 mb-4">{myRole.description}</p>
              
              <div className="bg-black/20 rounded-lg p-3">
                <p className="text-xs opacity-80 mb-2">Team</p>
                <p className="font-semibold">{myRole.team}</p>
              </div>
            </div>
          </div>
        )}

        {/* Game State */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4 border border-white/20">
          <div className="text-center text-white">
            <p className="text-purple-200 text-sm">Current Phase</p>
            <p className="text-xl font-bold">{session.state}</p>
            <p className="text-purple-200 text-sm mt-2">Day {session.currentDay}</p>
          </div>
        </div>

        {/* Voting Interface */}
        {session.state === GameState.DAY_VOTING && myPlayer.isAlive && myPlayer.hasVoteRights && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Cast Your Vote</h3>
            
            <div className="space-y-2 mb-4">
              <button
                onClick={() => setSelectedVoteTarget(null)}
                className={`
                  w-full py-3 rounded-lg font-semibold transition-all
                  ${selectedVoteTarget === null
                    ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }
                `}
              >
                Skip / No Vote
              </button>
              
              {alivePlayers.map((player) => (
                <button
                  key={player.id}
                  onClick={() => setSelectedVoteTarget(player.id)}
                  className={`
                    w-full py-3 rounded-lg font-semibold transition-all
                    ${selectedVoteTarget === player.id
                      ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }
                  `}
                >
                  {player.nickname} (#{player.slotNumber})
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitVote}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Submit Vote
            </button>
          </div>
        )}

        {/* Night Action Interface */}
        {myPlayer.isAlive && myRole && (
          <>
            {/* Mafia Kill */}
            {session.state === GameState.NIGHT_MAFIA && myRole.abilities.kill?.enabled && (
              <div className="bg-red-900/30 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Choose Target to Kill</h3>
                
                <div className="space-y-2 mb-4">
                  {alivePlayers.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedNightTarget(player.id)}
                      className={`
                        w-full py-3 rounded-lg font-semibold transition-all
                        ${selectedNightTarget === player.id
                          ? 'bg-red-600 text-white ring-2 ring-red-300'
                          : 'bg-white/10 text-red-200 hover:bg-white/20'
                        }
                      `}
                    >
                      {player.nickname} (#{player.slotNumber})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleSubmitNightAction('KILL')}
                  disabled={!selectedNightTarget}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg disabled:opacity-50"
                >
                  Confirm Kill
                </button>
              </div>
            )}

            {/* Doctor Heal */}
            {session.state === GameState.NIGHT_DOCTOR && myRole.abilities.heal?.enabled && (
              <div className="bg-green-900/30 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Choose Player to Heal</h3>
                
                <div className="space-y-2 mb-4">
                  {session.players.filter(p => p.isAlive).map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedNightTarget(player.id)}
                      className={`
                        w-full py-3 rounded-lg font-semibold transition-all
                        ${selectedNightTarget === player.id
                          ? 'bg-green-600 text-white ring-2 ring-green-300'
                          : 'bg-white/10 text-green-200 hover:bg-white/20'
                        }
                      `}
                    >
                      {player.nickname} (#{player.slotNumber})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleSubmitNightAction('HEAL')}
                  disabled={!selectedNightTarget}
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg disabled:opacity-50"
                >
                  Confirm Heal
                </button>
              </div>
            )}

            {/* Detective Check */}
            {session.state === GameState.NIGHT_DETECTIVE && myRole.abilities.check?.enabled && (
              <div className="bg-blue-900/30 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Choose Player to Investigate</h3>
                
                <div className="space-y-2 mb-4">
                  {alivePlayers.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => setSelectedNightTarget(player.id)}
                      className={`
                        w-full py-3 rounded-lg font-semibold transition-all
                        ${selectedNightTarget === player.id
                          ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                          : 'bg-white/10 text-blue-200 hover:bg-white/20'
                        }
                      `}
                    >
                      {player.nickname} (#{player.slotNumber})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleSubmitNightAction('CHECK')}
                  disabled={!selectedNightTarget}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                >
                  Confirm Investigation
                </button>
              </div>
            )}
          </>
        )}

        {/* Dead Player Message */}
        {!myPlayer.isAlive && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-600 text-center">
            <div className="text-6xl mb-4">💀</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">You are eliminated</h3>
            <p className="text-gray-400">Watch the game continue on the TV display</p>
          </div>
        )}

        {/* Connection Status */}
        <div className="fixed bottom-4 right-4">
          <div className={`px-4 py-2 rounded-lg ${isConnected ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
      </div>
    </>
  );
}
