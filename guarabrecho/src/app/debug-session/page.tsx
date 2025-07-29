'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Session Info</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
          
          {session && (
            <div className="mt-4">
              <h3 className="font-semibold">Session Data:</h3>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/auth/signin')}
              className="block w-full text-left p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Sign In
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="block w-full text-left p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/test-login')}
              className="block w-full text-left p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Go to Test Login
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current URL Info</h2>
          <p><strong>Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
