'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  User,
  Lock,
  Mail,
  Settings,
  Bell,
  Search,
  Plus,
  X,
  RefreshCcw,
  TrendingUp,
  List,
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Timer,
  Utensils,
  HeartPulse,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Plane,
  Car,
  Home,
  Info,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  Target,
  Award,
  Clock3,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle2,
  Navigation,
  ArrowUpRight,
  TrendingDown,
  Brain,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QueueAnimation } from '@/components/ui/queue-animation';
import { useRouter } from 'next/navigation';

interface Queue {
  id: string;
  name: string;
  description: string;
  category: string;
  currentUsers: number;
  estimatedWaitTime: string;
  status: 'active' | 'paused' | 'closed';
  location: string;
  rating: number;
}

interface UserStats {
  queuesJoined: number;
  timeSaved: string;
  avgRating: number;
  completionRate: number;
  currentStreak: number;
  totalWaitTime: string;
}

interface SmartRecommendation {
  queueId: string;
  name: string;
  category: string;
  location: string;
  currentUsers: number;
  estimatedWait: string;
  estimatedWaitMinutes: number;
  score: number;
  isPeakHour: boolean;
  recommendation: string;
  confidence: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return <Utensils className="w-5 h-5" />;
    case 'medical': return <HeartPulse className="w-5 h-5" />;
    case 'admin': return <Briefcase className="w-5 h-5" />;
    case 'education': return <GraduationCap className="w-5 h-5" />;
    case 'shopping': return <ShoppingBag className="w-5 h-5" />;
    case 'transport': return <Plane className="w-5 h-5" />;
    case 'automotive': return <Car className="w-5 h-5" />;
    case 'home': return <Home className="w-5 h-5" />;
    default: return <Info className="w-5 h-5" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'closed': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export default function UserDashboard() {
  const router = useRouter();
  const [sidebarOpen] = useState(false);
  const [joinedQueue, setJoinedQueue] = useState<Queue | null>(null);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    queuesJoined: 0,
    timeSaved: '0m',
    avgRating: 0,
    completionRate: 0,
    currentStreak: 0,
    totalWaitTime: '0m'
  });
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([]);

  useEffect(() => {
    // Auth guard
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    if (!token || role !== 'user') {
      router.push('/');
      return;
    }

    const load = async () => {
      try {
        // Load available queues
        const resQueues = await fetch(`${API_URL}/queues?status=active`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const dataQueues = await resQueues.json();
        if (resQueues.ok && dataQueues.success) {
          const mapped: Queue[] = (dataQueues.data || []).map((q: any) => ({
            id: q._id,
            name: q.name,
            description: q.description || '',
            category: (q.category || 'other').toString(),
            currentUsers: q.queueLength ?? (q.currentUsers?.length || 0),
            estimatedWaitTime: `${(q.settings?.estimatedWaitTime ?? q.stats?.averageWaitTime ?? 5)} min`,
            status: (q.status || 'active') as 'active' | 'paused' | 'closed',
            location: q.location || '—',
            rating: q.rating?.average ?? 0
          }));
          setQueues(mapped);
        }

        // Load my current queues (if any)
        const resMy = await fetch(`${API_URL}/users/my-queues`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const dataMy = await resMy.json();
        if (resMy.ok && dataMy.success && Array.isArray(dataMy.data) && dataMy.data.length > 0) {
          const q = dataMy.data[0];
          const mappedJoined: Queue = {
            id: q._id,
            name: q.name,
            description: q.description || '',
            category: (q.category || 'other').toString(),
            currentUsers: q.queueLength ?? (q.currentUsers?.length || 0),
            estimatedWaitTime: `${q.estimatedWaitTime ?? q.settings?.estimatedWaitTime ?? 5} min`,
            status: (q.status || 'active'),
            location: q.location || '—',
            rating: q.rating?.average ?? 0
          } as Queue;
          setJoinedQueue(mappedJoined);
          setUserPosition(q.userPosition ?? 1);
          setEstimatedWaitTime(`${q.estimatedWaitTime ?? q.settings?.estimatedWaitTime ?? 5} min`);
        } else {
          setJoinedQueue(null);
          setUserPosition(null);
          setEstimatedWaitTime(null);
        }

        // Load user stats (optional)
        const resStats = await fetch(`${API_URL}/users/stats`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const dataStats = await resStats.json().catch(() => ({}));
        if (resStats.ok && dataStats.success) {
          const s = dataStats.data;
          setUserStats({
            queuesJoined: s.queuesJoined ?? 0,
            timeSaved: `${s.timeSaved ?? 0}m`,
            avgRating: s.averageWaitTime ?? 0,
            completionRate: 0,
            currentStreak: 0,
            totalWaitTime: `${s.totalWaitTime ?? 0}m`
          });
        }

        // Load smart recommendations
        const resRecs = await fetch(`${API_URL}/smart/recommendations?limit=3`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const dataRecs = await resRecs.json();
        if (resRecs.ok && dataRecs.success) {
          setSmartRecommendations(dataRecs.data || []);
        }
      } catch (e) {
        // non-fatal for UI
        console.warn('Failed to load dashboard data', e);
      }
    };

    load();
  }, []);

  const filteredQueues = queues.filter(queue => {
    const matchesCategory = category === 'all' || queue.category.toLowerCase() === category;
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && queue.id !== joinedQueue?.id;
  });

  const handleJoinQueue = (queueId: string) => {
    joinQueue(queueId);
  };

  const handleLeaveQueue = (queueId: string) => {
    leaveQueue(queueId);
  };

  const handleRefresh = () => {
    // No-op placeholder; could re-trigger load effect
    window.location.reload();
  };

  async function joinQueue(queueId: string) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_URL}/queues/${queueId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error || 'Join failed');
      const queue = queues.find(q => q.id === queueId);
      if (queue) {
        setJoinedQueue(queue);
        setUserPosition(data.data.position);
        setEstimatedWaitTime(`${data.data.estimatedWaitTime} min`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function leaveQueue(queueId: string) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_URL}/queues/${queueId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        console.warn('Leave queue failed (non-fatal):', data?.error || res.statusText);
      }
      // Clear local state regardless so UI doesn't get stuck
      setJoinedQueue(null);
      setUserPosition(null);
      setEstimatedWaitTime(null);
    } catch (e) {
      // Non-fatal: clear local state
      console.warn('Leave queue error (non-fatal):', e);
      setJoinedQueue(null);
      setUserPosition(null);
      setEstimatedWaitTime(null);
    }
  }

  const sidebarItems: never[] = [];

  return (
    <>
      {/* Main Dashboard Content */}
      <div className="space-y-6">
          {/* Current Queue Status */}
          {joinedQueue ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Queue Header with Leave Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    {getCategoryIcon(joinedQueue.category)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{joinedQueue.name}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Your current queue</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLeaveQueue(joinedQueue.id)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 transition-all text-sm font-medium"
                >
                  Leave Queue
                </button>
              </div>

              {/* Interactive Queue Animation */}
              <QueueAnimation
                queues={[{
                  queueId: joinedQueue.id,
                  userPosition: userPosition || 1,
                  totalPeople: joinedQueue.currentUsers || 1,
                  estimatedWaitTime: estimatedWaitTime || '5 min',
                  queueName: joinedQueue.name
                }]}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No Active Queue</h2>
              <p className="text-sm text-gray-400">
                You haven't joined any queues yet. Explore available queues below!
              </p>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <List className="w-4 h-4 text-blue-400" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 font-medium">Queues Joined</p>
                <p className="text-3xl font-semibold text-white">{userStats.queuesJoined}</p>
                <p className="text-xs text-emerald-400">+5% from last month</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 font-medium">Time Saved</p>
                <p className="text-3xl font-semibold text-white">{userStats.timeSaved}</p>
                <p className="text-xs text-emerald-400">+12% from last month</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 font-medium">Avg Rating</p>
                <p className="text-3xl font-semibold text-white">{userStats.avgRating}</p>
                <p className="text-xs text-emerald-400">+0.2 from last month</p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400 font-medium">Current Streak</p>
                <p className="text-3xl font-semibold text-white">{userStats.currentStreak}</p>
                <p className="text-xs text-gray-500">days in a row</p>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          {smartRecommendations.length > 0 && (
            <div className="rounded-xl border border-blue-500/30 bg-gray-900/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      Smart Recommendations
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </h3>
                    <p className="text-sm text-gray-400">AI-powered queue suggestions for you</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/user-dashboard/insights')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {smartRecommendations.map((rec) => (
                  <div
                    key={rec.queueId}
                    className="relative bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                    onClick={() => handleJoinQueue(rec.queueId)}
                  >
                    {/* Score badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                        rec.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                        rec.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {rec.score}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-white font-semibold mb-1 pr-12">{rec.name}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {rec.location}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-900/50 rounded p-2 text-center">
                        <Users className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                        <p className="text-xs text-gray-400">Queue</p>
                        <p className="text-sm font-semibold text-white">{rec.currentUsers}</p>
                      </div>
                      <div className="bg-gray-900/50 rounded p-2 text-center">
                        <Timer className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                        <p className="text-xs text-gray-400">Wait</p>
                        <p className="text-sm font-semibold text-white">{rec.estimatedWait}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-900/50 rounded p-2">
                      {rec.isPeakHour ? (
                        <AlertCircle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Star className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-xs text-gray-300 line-clamp-2">{rec.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Queue Categories */}
          <div className="flex flex-wrap gap-2">
            {['all', 'food', 'medical', 'administrative', 'education', 'retail', 'automotive'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-900/50 border border-gray-800/50 text-gray-400 hover:border-gray-700/50 hover:text-gray-300'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Queue Activity Chart */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-100">Queue Activity</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Food</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Medical</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Administrative</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Education</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">30%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wait Time Trends */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-100">Wait Time Trends</h3>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">This Week</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-16 bg-gray-700 rounded flex items-end justify-center space-x-1 p-1">
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '60%' }}></div>
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '80%' }}></div>
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '45%' }}></div>
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '90%' }}></div>
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '70%' }}></div>
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '85%' }}></div>
                      <div className="w-2 bg-sky-500 rounded-t" style={{ height: '55%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">12.5m avg</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Last Week</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-16 bg-gray-700 rounded flex items-end justify-center space-x-1 p-1">
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '70%' }}></div>
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '85%' }}></div>
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '60%' }}></div>
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '75%' }}></div>
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '80%' }}></div>
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '65%' }}></div>
                      <div className="w-2 bg-gray-500 rounded-t" style={{ height: '70%' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">15.2m avg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Queues */}
          <div className="bg-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100">Available Queues</h2>
              <p className="text-sm text-gray-400 mt-1">
                {filteredQueues.length} queue{filteredQueues.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="p-6">
              {filteredQueues.length > 0 ? (
                <div className="grid gap-6">
                  {filteredQueues.map((queue) => (
                    <div
                      key={queue.id}
                      className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                            {getCategoryIcon(queue.category)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-100">{queue.name}</h3>
                            <p className="text-gray-400 text-sm">{queue.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(queue.status)}`}>
                                {queue.status}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-300">
                                {queue.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center text-gray-300">
                        <div>
                          <p className="text-sm text-gray-500">Current Users</p>
                          <p className="text-xl font-semibold">{queue.currentUsers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Est. Wait Time</p>
                          <p className="text-xl font-semibold">{queue.estimatedWaitTime}</p>
                        </div>
                      </div>
                      <div className="mt-6 text-right">
                        <button
                          onClick={() => handleJoinQueue(queue.id)}
                          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          disabled={joinedQueue !== null || queue.status !== 'active'}
                        >
                          {queue.status !== 'active' ? 'Unavailable' : joinedQueue ? 'Already in Queue' : 'Join Queue'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8">No queues available in this category.</p>
              )}
            </div>
          </div>
      </div>
    </>
  );
}