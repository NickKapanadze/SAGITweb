import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function JoinGame() {
  const router = useRouter();
  const { partyCode } = router.query;
  const [nickname, setNickname] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!partyCode) return;

    // Fetch session to get available slots
    const fetchSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/${partyCode}/state`);
        
        // This would need the session ID, but for simplicity we'll just show slots 1-12
        const slots = Array.from({ length: 12 }, (_, i) => i + 1);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      }
    };

    fetchSession();
  }, [partyCode]);

  const handleJoin = async () => {
    if (!nickname.trim() || selectedSlot === null) {
      alert('Please enter your name and select a slot');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partyCode,
          slotNumber: selectedSlot,
          nickname: nickname.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store player info
        localStorage.setItem('playerId', data.playerId);
        localStorage.setItem('reconnectToken', data.reconnectToken);
        localStorage.setItem('sessionId', data.sessionId);

        // Redirect to player view
        router.push(`/player/${data.playerId}`);
      } else {
        alert(data.message || 'Failed to join game');
      }
    } catch (error) {
      console.error('Failed to join:', error);
      alert('Failed to join game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Join Game - Mafia Party</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">🎭 Join Game</h1>
              <p className="text-xl text-purple-200">Party Code: {partyCode}</p>
            </div>

            {/* Nickname Input */}
            <div className="mb-6">
              <label className="block text-purple-200 mb-2 font-semibold">
                Your Name
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                maxLength={20}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Slot Selection */}
            <div className="mb-8">
              <label className="block text-purple-200 mb-3 font-semibold">
                Select Your Slot
              </label>
              <div className="grid grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      py-4 rounded-lg font-semibold transition-all
                      ${selectedSlot === slot 
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300' 
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                      }
                    `}
                  >
                    #{slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={loading || !nickname.trim() || selectedSlot === null}
              className={`
                w-full py-4 rounded-lg font-bold text-lg transition-all
                ${loading || !nickname.trim() || selectedSlot === null
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'
                }
                text-white
              `}
            >
              {loading ? 'Joining...' : 'Join Game'}
            </button>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-purple-300 hover:text-purple-100 underline"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
