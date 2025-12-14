import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Session, GameState, ClientType } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

export default function TVDisplay() {
  const router = useRouter();
  const { partyCode } = router.query;
  const [session, setSession] = useState<Session | null>(null);
  const { isConnected, emit, on, off } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

  useEffect(() => {
    if (!partyCode || !isConnected) return;

    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      router.push('/');
      return;
    }

    // Join session as TV client
    emit('JOIN_SESSION', {
      sessionId,
      clientType: ClientType.TV,
    });

    // Listen for state updates
    const handleStateUpdate = (data: Session) => {
      setSession(data);
    };

    on('SESSION_STATE_UPDATE', handleStateUpdate);

    return () => {
      off('SESSION_STATE_UPDATE', handleStateUpdate);
    };
  }, [partyCode, isConnected]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl">Loading session...</p>
        </div>
      </div>
    );
  }

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/player/join/${partyCode}` : '';

  return (
    <>
      <Head>
        <title>Mafia Game - TV Display</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8">
        {/* Header with Party Code */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">🎭 Mafia Game</h1>
            <div className="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-xl border border-white/30">
              <p className="text-sm text-purple-200">Party Code</p>
              <p className="text-3xl font-bold text-white tracking-wider">{partyCode}</p>
            </div>
          </div>

          {/* QR Code for joining */}
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG value={joinUrl} size={120} />
            <p className="text-xs text-center mt-2 text-gray-600">Scan to join</p>
          </div>
        </div>

        {/* Game State Display */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Current Phase</p>
                <p className="text-2xl font-bold text-white">{getPhaseDisplay(session.state)}</p>
              </div>
              {session.state !== GameState.LOBBY && (
                <div>
                  <p className="text-purple-200 text-sm">Day</p>
                  <p className="text-2xl font-bold text-white">{session.currentDay}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-4 gap-4">
          {session.players.map((player) => (
            <div
              key={player.id}
              className={`
                bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20
                ${!player.isAlive ? 'opacity-50 grayscale' : ''}
                ${player.isConnected ? 'ring-2 ring-green-400' : ''}
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {player.isAlive ? '👤' : '💀'}
                </div>
                <p className="text-lg font-semibold text-white mb-1">{player.nickname}</p>
                <p className="text-sm text-purple-200">Slot #{player.slotNumber}</p>
                
                {/* Status indicators */}
                <div className="mt-3 flex justify-center gap-2">
                  {!player.isAlive && (
                    <span className="text-xs bg-red-500/30 text-red-200 px-2 py-1 rounded">
                      Eliminated
                    </span>
                  )}
                  {player.isConnected ? (
                    <span className="text-xs bg-green-500/30 text-green-200 px-2 py-1 rounded">
                      Online
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-500/30 text-gray-200 px-2 py-1 rounded">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lobby Instructions */}
        {session.state === GameState.LOBBY && (
          <div className="mt-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Waiting for Players...</h2>
              <p className="text-lg text-purple-200 mb-6">
                Share the party code or scan the QR code to join
              </p>
              <div className="text-purple-300">
                <p>• Players: {session.players.length} / {session.config.maxPlayers}</p>
                <p>• Host will start the game when ready</p>
              </div>
            </div>
          </div>
        )}

        {/* Speaking indicator during speeches */}
        {session.state === GameState.DAY_SPEECHES && session.speakingOrder.length > 0 && (
          <div className="mt-8">
            <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 max-w-2xl mx-auto">
              <p className="text-center text-xl text-yellow-200">
                🎤 Now Speaking: <span className="font-bold">
                  {session.players.find(p => p.slotNumber === session.speakingOrder[session.currentSpeaker])?.nickname}
                </span>
              </p>
            </div>
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

function getPhaseDisplay(state: GameState): string {
  const phaseNames: Record<GameState, string> = {
    [GameState.LOBBY]: 'Lobby',
    [GameState.WAITING_FOR_PLAYERS]: 'Waiting for Players',
    [GameState.DAY_DISCUSSION]: 'Day - Discussion',
    [GameState.DAY_SPEECHES]: 'Day - Final Speeches',
    [GameState.DAY_VOTING]: 'Day - Voting',
    [GameState.VOTE_RESULTS]: 'Vote Results',
    [GameState.NIGHT_MAFIA]: 'Night - Mafia',
    [GameState.NIGHT_SERIAL]: 'Night - Serial Killer',
    [GameState.NIGHT_DOCTOR]: 'Night - Doctor',
    [GameState.NIGHT_DETECTIVE]: 'Night - Detective',
    [GameState.NIGHT_RESOLUTION]: 'Night - Resolution',
    [GameState.GAME_END]: 'Game Over',
  };

  return phaseNames[state] || state;
}
