'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Queue {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'paused' | 'closed';
  averageWaitTime: number;
}

export default function JoinQueuesPage() {
  const router = useRouter();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          router.push('/');
          return;
        }
        const res = await fetch(`${API_URL}/queues`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (res.status === 401) {
          router.push('/');
          return;
        }
        if (!res.ok || data.success === false) throw new Error(data?.error || 'Failed to load queues');
        const mapped: Queue[] = (data.data || data.queues || []).map((q: any) => ({
          id: q._id,
          name: q.name,
          location: q.location || '—',
          status: q.status || 'active',
          averageWaitTime: q.averageWaitTime || 0,
        }));
        setQueues(mapped);
      } catch (e: any) {
        setError(e.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);

  const join = async (id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/');
        return;
      }
      const res = await fetch(`${API_URL}/queues/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/');
        return;
      }
      if (!res.ok || data.success === false) throw new Error(data?.error || 'Join failed');
      alert('Joined queue successfully');
    } catch (e: any) {
      alert(e.message || 'Join failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl p-6">
        <h1 className="text-xl font-semibold text-white">Join a Queue</h1>
        <p className="text-sm text-gray-400">Pick a queue to join. Data loads from the database.</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queues.map((q) => (
            <div key={q.id} className="group relative overflow-hidden rounded-lg border border-gray-800/60 bg-gray-900/30 p-5 hover:border-sky-500/30 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{q.name}</h3>
                  <p className="text-xs text-gray-500">{q.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Avg wait: {q.averageWaitTime} min</span>
                <button onClick={() => join(q.id)} className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-500 transition-colors flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


