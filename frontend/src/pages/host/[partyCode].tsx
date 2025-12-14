import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Session, GameState, ClientType, VotingMode } from '@/types';

export default function HostView() {
  const router = useRouter();
  const { partyCode } = router.query;
  const [session, setSession] = useState<Session | null>(null);
  const [hostToken, setHostToken] = useState<string>('');
  const { isConnected, emit, on, off } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

  useEffect(() => {
    if (!partyCode || !isConnected) return;

    // Get session info
    const fetchSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/host/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partyCode }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setHostToken(data.hostToken);
          localStorage.setItem('hostToken', data.hostToken);

          // Join session as host
          emit('JOIN_SESSION', {
            sessionId: data.sessionId,
            clientType: ClientType.HOST,
            hostToken: data.hostToken,
          });
        }
      } catch (error) {
        console.error('Failed to connect as host:', error);
        alert('Failed to connect as host');
        router.push('/');
      }
    };

    fetchSession();

    // Listen for state updates
    const handleStateUpdate = (data: Session) => {
      setSession(data);
    };

    on('SESSION_STATE_UPDATE', handleStateUpdate);

    return () => {
      off('SESSION_STATE_UPDATE', handleStateUpdate);
    };
  }, [partyCode, isConnected]);

  const handleStartGame = () => {
    if (!session) return;
    
    if (session.players.length < 4) {
      alert('Need at least 4 players to start');
      return;
    }

    emit('START_GAME', { sessionId: session.id });
  };

  const handleNextPhase = () => {
    if (!session) return;
    emit('NEXT_PHASE', { sessionId: session.id });
  };

  const handleAssignFoul = (playerId: string) => {
    if (!session) return;
    
    const reason = prompt('Reason for foul (optional):');
    emit('ASSIGN_FOUL', {
      sessionId: session.id,
      playerId,
      reason: reason || undefined,
    });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading host panel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Host Panel - Mafia Game</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🎮 Host Control Panel</h1>
              <p className="text-blue-100">Party Code: {partyCode}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${isConnected ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current State */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Game Status</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Phase</p>
                    <p className="text-lg font-semibold">{session.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Day</p>
                    <p className="text-lg font-semibold">{session.currentDay}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Players</p>
                    <p className="text-lg font-semibold">
                      {session.players.filter(p => p.isAlive).length} / {session.players.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Voting Mode</p>
                    <p className="text-lg font-semibold">{session.config.votingMode}</p>
                  </div>
                </div>
              </div>

              {/* Phase Controls */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Phase Controls</h2>
                <div className="flex gap-4">
                  {session.state === GameState.LOBBY && (
                    <button
                      onClick={handleStartGame}
                      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      ▶️ Start Game
                    </button>
                  )}
                  {session.state !== GameState.LOBBY && session.state !== GameState.GAME_END && (
                    <button
                      onClick={handleNextPhase}
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      ⏭️ Next Phase
                    </button>
                  )}
                </div>
              </div>

              {/* Players List */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Players</h2>
                <div className="space-y-2">
                  {session.players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        player.isAlive ? 'bg-gray-700' : 'bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{player.isAlive ? '👤' : '💀'}</span>
                        <div>
                          <p className="font-semibold">{player.nickname}</p>
                          <p className="text-sm text-gray-400">Slot #{player.slotNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {player.isConnected ? (
                          <span className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded">
                            Online
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-500/30 text-gray-300 px-2 py-1 rounded">
                            Offline
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleAssignFoul(player.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm transition-colors"
                        >
                          ⚠️ Foul
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Config & Info */}
            <div className="space-y-6">
              {/* Game Config */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Configuration</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400">Max Players</p>
                    <p className="font-semibold">{session.config.maxPlayers}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Voting Mode</p>
                    <p className="font-semibold">{session.config.votingMode}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Auto-kick Fouls</p>
                    <p className="font-semibold">
                      {session.config.autoKickFouls === 0 ? 'Disabled' : session.config.autoKickFouls}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Mid-game Join</p>
                    <p className="font-semibold">
                      {session.config.allowMidGameJoin ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fouls Log */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Recent Fouls</h2>
                <div className="space-y-2">
                  {session.fouls && session.fouls.length > 0 ? (
                    session.fouls.slice(-5).reverse().map((foul) => {
                      const player = session.players.find(p => p.id === foul.playerId);
                      return (
                        <div key={foul.id} className="text-sm bg-gray-700 p-3 rounded">
                          <p className="font-semibold">{player?.nickname}</p>
                          {foul.reason && (
                            <p className="text-gray-400 text-xs">{foul.reason}</p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-400 text-sm">No fouls yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
