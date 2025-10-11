'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Settings,
  Bell,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Timer,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Queue {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'paused' | 'closed';
  totalUsers: number;
  waitingUsers: number;
  averageWaitTime: number;
  servedToday: number;
  lastUpdated: string;
}

interface QueueUser {
  id: string;
  name: string;
  joinTime: string;
  position: number;
  estimatedWaitTime: number;
  status: 'waiting' | 'called' | 'serving';
}

export default function Dashboard() {
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
        const res = await fetch(`${API_URL}/queues`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (!res.ok || data.success === false) throw new Error(data?.error || 'Failed to load queues');
        const mapped: Queue[] = (data.data || data.queues || []).map((q: any) => ({
          id: q._id,
          name: q.name,
          location: q.location || '—',
          status: q.status || 'active',
          totalUsers: q.stats?.totalUsers || q.totalUsers || 0,
          waitingUsers: (q.queueLength ?? q.currentUsers?.length ?? q.waitingUsers ?? 0),
          averageWaitTime: (q.stats?.averageWaitTime ?? q.settings?.estimatedWaitTime ?? q.averageWaitTime ?? 0),
          servedToday: q.servedToday || 0,
          lastUpdated: q.updatedAt ? new Date(q.updatedAt).toLocaleTimeString() : '—',
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

  const [view, setView] = useState<'overview' | 'queue-detail'>('overview');
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'closed'>('all');

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || queue.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalWaitingUsers = queues.reduce((sum, q) => sum + q.waitingUsers, 0);
  const totalServedToday = queues.reduce((sum, q) => sum + q.servedToday, 0);
  const averageWaitTime = queues.length > 0 ? Math.round(
    queues.reduce((sum, q) => sum + q.averageWaitTime, 0) / queues.length
  ) : 0;
  const activeQueues = queues.filter(q => q.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20';
      case 'paused':
        return 'text-amber-400 bg-amber-400/10 border border-amber-400/20';
      case 'closed':
        return 'text-gray-400 bg-gray-400/10 border border-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border border-gray-400/20';
    }
  };

  const mockQueueUsers: QueueUser[] = [
    { id: '1', name: 'John Doe', joinTime: '10:30 AM', position: 1, estimatedWaitTime: 5, status: 'serving' },
    { id: '2', name: 'Jane Smith', joinTime: '10:35 AM', position: 2, estimatedWaitTime: 12, status: 'called' },
    { id: '3', name: 'Bob Johnson', joinTime: '10:40 AM', position: 3, estimatedWaitTime: 18, status: 'waiting' },
    { id: '4', name: 'Alice Brown', joinTime: '10:45 AM', position: 4, estimatedWaitTime: 24, status: 'waiting' },
    { id: '5', name: 'Charlie Wilson', joinTime: '10:50 AM', position: 5, estimatedWaitTime: 30, status: 'waiting' },
  ];

  return (
    <div className="space-y-6">
      {view === 'overview' ? (
        <div className="space-y-6">
          {/* Stats Grid - Minimalist Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, delay: 0 }}
              className="group relative overflow-hidden rounded-xl border border-gray-800/60 bg-gradient-to-br from-gray-900/60 to-gray-900/30 backdrop-blur-xl p-6 hover:border-sky-500/30 transition-all duration-300 will-change-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-medium">Total Waiting</p>
                  <p className="text-3xl font-semibold text-white">{totalWaitingUsers}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    12% from yesterday
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-gray-800/60 bg-gradient-to-br from-gray-900/60 to-gray-900/30 backdrop-blur-xl p-6 hover:border-sky-500/30 transition-all duration-300 will-change-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-medium">Served Today</p>
                  <p className="text-3xl font-semibold text-white">{totalServedToday}</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    8% from yesterday
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="group relative overflow-hidden rounded-xl border border-gray-800/60 bg-gradient-to-br from-gray-900/60 to-gray-900/30 backdrop-blur-xl p-6 hover:border-sky-500/30 transition-all duration-300 will-change-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Timer className="w-5 h-5 text-amber-400" />
                  </div>
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-medium">Avg Wait Time</p>
                  <p className="text-3xl font-semibold text-white">{averageWaitTime}m</p>
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    5% increase
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="group relative overflow-hidden rounded-xl border border-gray-800/60 bg-gradient-to-br from-gray-900/60 to-gray-900/30 backdrop-blur-xl p-6 hover:border-sky-500/30 transition-all duration-300 will-change-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-400 font-medium">Active Queues</p>
                  <p className="text-3xl font-semibold text-white">{activeQueues}</p>
                  <p className="text-xs text-gray-500">of {queues.length} total</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Queue Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl overflow-hidden"
          >
            <div className="border-b border-gray-800/50 bg-gray-900/30 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Queue Management</h2>
                  <p className="text-sm text-gray-400 mt-1">Monitor and control all active queues</p>
                </div>
                <button onClick={() => router.push('/dashboard/queues/new')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Queue
                </button>
              </div>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search queues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                  />
                </div>
                <button className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50 text-gray-300 hover:border-gray-700/50 transition-colors flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredQueues.map((queue, idx) => (
                  <motion.div
                    key={queue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    transition={{ duration: 0.3, delay: 0.05 * idx }}
                    onClick={() => {
                      setSelectedQueue(queue);
                      setView('queue-detail');
                    }}
                    className="group relative overflow-hidden rounded-lg border border-gray-800/60 bg-gray-900/30 p-5 cursor-pointer hover:border-sky-500/30 hover:bg-gray-900/50 transition-all duration-200 will-change-transform"
                  >
                    {/* Hover gradients and glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-transparent group-hover:from-blue-500/5 transition-all duration-300" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20">
                            <MapPin className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">{queue.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{queue.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(queue.status)}`}>
                            {queue.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-lg bg-gray-800/30 p-3 border border-gray-800/30">
                          <p className="text-xl font-semibold text-white">{queue.waitingUsers}</p>
                          <p className="text-xs text-gray-500 mt-1">Waiting</p>
                        </div>
                        <div className="rounded-lg bg-gray-800/30 p-3 border border-gray-800/30">
                          <p className="text-xl font-semibold text-white">{queue.averageWaitTime}m</p>
                          <p className="text-xs text-gray-500 mt-1">Avg Wait</p>
                        </div>
                        <div className="rounded-lg bg-gray-800/30 p-3 border border-gray-800/30">
                          <p className="text-xl font-semibold text-white">{queue.servedToday}</p>
                          <p className="text-xs text-gray-500 mt-1">Served</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-800/30 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Updated {queue.lastUpdated}</span>
                        <button className="p-1 hover:bg-gray-800/50 rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        selectedQueue && (
          <div className="space-y-6">
            {/* Queue Detail Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setView('overview')}
                  className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors text-sm"
                >
                  ← Back
                </button>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-100">{selectedQueue.name}</h2>
                  <p className="text-sm text-gray-400">{selectedQueue.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors text-sm">
                  Call Next
                </button>
                <button className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Queue Users List */}
            <div className="rounded-xl border border-gray-800/50 bg-gray-900/30 overflow-hidden">
              <div className="border-b border-gray-800/50 bg-gray-900/50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-100">Current Queue</h3>
              </div>
              <div className="divide-y divide-gray-800/50">
                {mockQueueUsers.map((user) => (
                  <div key={user.id} className="px-6 py-4 hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-semibold text-white">
                          {user.position}
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">{user.name}</p>
                          <p className="text-sm text-gray-500">Joined at {user.joinTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Est. wait</p>
                          <p className="font-medium text-gray-100">{user.estimatedWaitTime} min</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'serving'
                              ? 'bg-blue-500/20 text-blue-400'
                              : user.status === 'called'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {user.status}
                        </span>
                        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors">
                          {user.status === 'waiting' ? 'Call' : 'Serve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}