'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewQueuePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('General');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  const createQueue = async () => {
    try {
      setSaving(true);
      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_URL}/queues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, location, category, status: 'active' }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push('/');
        return;
      }
      if (!res.ok || data.success === false) throw new Error(data?.error || 'Failed to create');
      router.push('/dashboard/queues');
    } catch (e: any) {
      setError(e.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl p-6">
        <h1 className="text-xl font-semibold text-white">Create New Queue</h1>
        <p className="text-sm text-gray-400">Add a queue that users can join.</p>
      </div>

      <div className="rounded-xl border border-gray-800/50 bg-gray-900/30 p-6 space-y-4">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-900/50 border border-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50" placeholder="e.g. Main Canteen" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-900/50 border border-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50" placeholder="e.g. Building A - Level 1" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-900/50 border border-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50" placeholder="e.g. Food" />
        </div>
        <div className="pt-2">
          <button onClick={createQueue} disabled={saving || !name} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Queue'}
          </button>
        </div>
      </div>
    </div>
  );
}


