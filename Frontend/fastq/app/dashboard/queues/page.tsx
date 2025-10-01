'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, MoreVertical, Users, Clock, Play, Pause, Settings, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Queue {
  _id: string;
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  status: 'active' | 'paused' | 'closed';
  currentUsers: Array<{
    user: string;
    position: number;
    joinedAt: string;
    status: string;
  }>;
  settings: {
    maxUsers: number;
    estimatedWaitTime: number;
    allowJoin: boolean;
  };
  queueLength: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminQueuesPage() {
  const router = useRouter();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    if (!token || role !== 'admin') {
      router.push('/');
      return;
    }

    fetchQueues();
  }, [router]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const res = await fetch(`${API_URL}/queues?status=all`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push('/');
        }
        throw new Error(data.error || 'Failed to fetch queues');
      }
      
      setQueues(data.data || []);
    } catch (err: any) {
      console.error('Error fetching queues:', err);
      setError(err.message || 'Failed to load queues');
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (queueId: string, newStatus: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_URL}/queues/${queueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push('/');
        }
        throw new Error(data.error || 'Failed to update queue status');
      }

      // Refresh queues list
      fetchQueues();
    } catch (err: any) {
      console.error('Error updating queue status:', err);
      setError(err.message || 'Failed to update queue status');
    }
  };

  const deleteQueue = async (queueId: string) => {
    if (!confirm('Are you sure you want to delete this queue? This action cannot be undone.')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_URL}/queues/${queueId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push('/');
        }
        throw new Error(data.error || 'Failed to delete queue');
      }

      // Refresh queues list
      fetchQueues();
    } catch (err: any) {
      console.error('Error deleting queue:', err);
      setError(err.message || 'Failed to delete queue');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      case 'closed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return 'text-orange-400 bg-orange-400/10';
      case 'medical': return 'text-red-400 bg-red-400/10';
      case 'admin': return 'text-blue-400 bg-blue-400/10';
      case 'education': return 'text-purple-400 bg-purple-400/10';
      case 'shopping': return 'text-pink-400 bg-pink-400/10';
      case 'transport': return 'text-cyan-400 bg-cyan-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || queue.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || queue.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading queues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading queues</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          onClick={fetchQueues}
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Queue Management</h1>
        <button 
          onClick={() => router.push('/dashboard/queues/new')}
          className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Queue</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search queues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="food">Food</option>
              <option value="medical">Medical</option>
              <option value="admin">Admin</option>
              <option value="education">Education</option>
              <option value="shopping">Shopping</option>
              <option value="transport">Transport</option>
              <option value="other">Other</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{queues.length}</div>
          <div className="text-sm text-gray-400">Total Queues</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Current</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">
            {queues.reduce((sum, queue) => sum + (queue.currentUsers?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-400">Users in Queue</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-gray-400">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">
            {queues.length > 0 ? Math.round(queues.reduce((sum, queue) => sum + (queue.settings?.estimatedWaitTime || 0), 0) / queues.length) : 0}m
          </div>
          <div className="text-sm text-gray-400">Wait Time</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Play className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">
            {queues.filter(q => q.status === 'active').length}
          </div>
          <div className="text-sm text-gray-400">Running</div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {filteredQueues.map((queue) => (
          <motion.div 
            key={queue._id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-100">{queue.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(queue.category)}`}>
                    {formatCategory(queue.category)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                    {queue.status}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mb-2">{queue.location}</div>
                {queue.description && (
                  <div className="text-gray-500 text-sm mb-4">{queue.description}</div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-sky-400">{queue.currentUsers?.length || 0}</div>
                    <div className="text-xs text-gray-400">Current Users</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">{queue.settings?.maxUsers || 0}</div>
                    <div className="text-xs text-gray-400">Max Capacity</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-yellow-400">{queue.settings?.estimatedWaitTime || 0}m</div>
                    <div className="text-xs text-gray-400">Est. Wait Time</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-400">
                      {new Date(queue.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">Last Updated</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => router.push(`/dashboard/queues/${queue._id}/edit`)}
                  className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all"
                  title="Edit Queue"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteQueue(queue._id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                  title="Delete Queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center space-x-3">
                {queue.status === 'active' ? (
                  <button 
                    onClick={() => updateQueueStatus(queue._id, 'paused')}
                    className="bg-yellow-600/20 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-600/30 transition-all text-sm flex items-center space-x-2"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => updateQueueStatus(queue._id, 'active')}
                    className="bg-green-600/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-600/30 transition-all text-sm flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Resume</span>
                  </button>
                )}
                <button 
                  onClick={() => updateQueueStatus(queue._id, 'closed')}
                  className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-all text-sm"
                >
                  Close
                </button>
                <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                  View Details
                </button>
                <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                  Manage Users
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Queue ID: {queue._id}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredQueues.length === 0 && !loading && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Queues Found</h3>
          <p className="text-gray-400 mb-6">
            {queues.length === 0 
              ? "You haven't created any queues yet." 
              : "No queues match your search criteria."
            }
          </p>
          <button 
            onClick={() => router.push('/dashboard/queues/new')}
            className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all"
          >
            Create New Queue
          </button>
        </div>
      )}
    </div>
  );
}



