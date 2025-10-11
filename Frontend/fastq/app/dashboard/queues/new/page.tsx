'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NewQueuePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('other');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  const createQueue = async () => {
    console.log('=== CREATE QUEUE STARTED ===');
    console.log('API_URL:', API_URL);
    console.log('Form data:', { name, description, location, category });
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('/');
        return;
      }

      const requestBody = { 
        name, 
        description, 
        location, 
        category,
        settings: {
          maxUsers: 100,
          estimatedWaitTime: 5,
          allowJoin: true
        }
      };
      
      console.log('Request body:', requestBody);
      console.log('Making POST request to:', `${API_URL}/queues`);

      const res = await fetch(`${API_URL}/queues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.status === 401 || res.status === 403) {
        console.log('Unauthorized, redirecting to login');
        router.push('/');
        return;
      }
      
      if (!res.ok || !data.success) {
        const errorMsg = data.errors?.[0]?.msg || data.error || 'Failed to create queue';
        console.error('Queue creation failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Queue created successfully!');
      setSuccess('Queue created successfully!');
      setName('');
      setDescription('');
      setLocation('');
      setCategory('other');
      
      // Redirect after a short delay
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        router.push('/dashboard');
      }, 1500);
      
    } catch (e: any) {
      console.error('Create queue error:', e);
      console.error('Error stack:', e.stack);
      setError(e.message || 'Failed to create queue');
    } finally {
      setSaving(false);
      console.log('=== CREATE QUEUE ENDED ===');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-gray-900/50 border border-gray-800/50 rounded-xl shadow-lg backdrop-blur-xl"
    >
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <PlusCircle className="w-7 h-7 text-blue-500" /> Create New Queue
      </h1>

      <form onSubmit={(e) => { e.preventDefault(); createQueue(); }} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Queue Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            placeholder="e.g. Main Canteen"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            placeholder="Brief description of the queue..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            placeholder="e.g. Building A, Ground Floor"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            required
          >
            <option value="food">Food & Dining</option>
            <option value="medical">Medical & Health</option>
            <option value="admin">Administrative</option>
            <option value="education">Education</option>
            <option value="shopping">Shopping</option>
            <option value="transport">Transportation</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg text-sm"
          >
            {success}
          </motion.div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={saving || !name || !location}
          >
            {saving ? 'Creating...' : 'Create Queue'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/queues')}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

