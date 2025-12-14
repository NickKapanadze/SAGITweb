import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'tv' | 'host' | 'player' | null>(null);

  const handleCreateSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store session info in localStorage
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('partyCode', data.partyCode);
        localStorage.setItem('hostToken', data.hostToken);
        
        // Redirect to TV view
        router.push(`/tv/${data.partyCode}`);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  const handleJoinAsHost = () => {
    const partyCode = prompt('Enter 6-digit party code:');
    if (partyCode && partyCode.length === 6) {
      router.push(`/host/${partyCode}`);
    }
  };

  const handleJoinAsPlayer = () => {
    const partyCode = prompt('Enter 6-digit party code:');
    if (partyCode && partyCode.length === 6) {
      router.push(`/player/join/${partyCode}`);
    }
  };

  return (
    <>
      <Head>
        <title>Mafia Party Game - SAGIT Web</title>
        <meta name="description" content="Browser-based Mafia party game platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              🎭 Mafia Party Game
            </h1>
            <p className="text-xl text-purple-200">
              A browser-based party game platform inspired by Kahoot
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* TV / Main Display */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-center">
                <div className="text-5xl mb-4">📺</div>
                <h2 className="text-2xl font-bold text-white mb-3">TV Display</h2>
                <p className="text-purple-200 mb-6 text-sm">
                  Create a new game session and display on TV or projector
                </p>
                <button
                  onClick={handleCreateSession}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  Create Session
                </button>
              </div>
            </div>

            {/* Host / Game Master */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-center">
                <div className="text-5xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-white mb-3">Host</h2>
                <p className="text-purple-200 mb-6 text-sm">
                  Control the game flow and manage players
                </p>
                <button
                  onClick={handleJoinAsHost}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
                >
                  Connect as Host
                </button>
              </div>
            </div>

            {/* Player */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
              <div className="text-center">
                <div className="text-5xl mb-4">👥</div>
                <h2 className="text-2xl font-bold text-white mb-3">Player</h2>
                <p className="text-purple-200 mb-6 text-sm">
                  Join a game with your phone or PC
                </p>
                <button
                  onClick={handleJoinAsPlayer}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                >
                  Join Game
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-purple-300 text-sm">
            <p>Built with Next.js, NestJS, and WebSocket</p>
            <p className="mt-2">SAGIT Web © 2024</p>
          </div>
        </div>
      </main>
    </>
  );
}
