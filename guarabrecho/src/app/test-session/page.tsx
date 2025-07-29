'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestSession() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Test Session Status</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold">Status:</h2>
        <p>{status}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-semibold">Session Data:</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="space-x-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
        
        <button 
          onClick={() => router.push('/auth/signin')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
