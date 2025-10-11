'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Clock,
  Users,
  Zap,
  AlertCircle,
  Star,
  ArrowRight,
  Calendar,
  MapPin,
  Activity,
  Award,
  Sparkles,
  ChevronRight,
  BarChart3,
  Timer,
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Recommendation {
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

interface PeakHour {
  hour: number;
  day: string;
  avgUsers: number;
  timeRange: string;
}

interface WaitTimePrediction {
  estimatedWaitMinutes: number;
  estimatedWaitDisplay: string;
  confidence: string;
  currentQueueLength: number;
  historicalSamples: number;
  range: {
    min: number;
    max: number;
  } | null;
}

export default function SmartInsightsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [waitPrediction, setWaitPrediction] = useState<WaitTimePrediction | null>(null);

  useEffect(() => {
    fetchSmartInsights();
  }, []);

  const fetchSmartInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`${API_URL}/smart/insights`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRecommendations(data.data.recommendations || []);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeakHours = async (queueId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/smart/peak-hours/${queueId}?daysBack=7`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPeakHours(data.data.topPeakHours || []);
      }
    } catch (error) {
      console.error('Error fetching peak hours:', error);
    }
  };

  const fetchWaitPrediction = async (queueId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/smart/wait-time/${queueId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWaitPrediction(data.data);
      }
    } catch (error) {
      console.error('Error fetching wait prediction:', error);
    }
  };

  const handleQueueSelect = (queueId: string) => {
    setSelectedQueue(queueId);
    fetchPeakHours(queueId);
    fetchWaitPrediction(queueId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-orange-500/20 border-orange-500/30';
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[confidence as keyof typeof colors] || colors.low;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      food: '🍽️',
      medical: '🏥',
      admin: '📋',
      education: '📚',
      other: '📍',
    };
    return icons[category as keyof typeof icons] || icons.other;
  };


  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Smart Insights</h1>
            <p className="text-gray-400">AI-powered queue recommendations</p>
          </div>
        </div>
      </motion.div>

      {/* Smart Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Recommendations List */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Top Recommendations</h2>
              </div>
              <button
                onClick={fetchSmartInsights}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
              >
                Refresh
              </button>
            </div>

            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recommendations available</p>
                  <p className="text-sm mt-1">Join some queues to get personalized insights</p>
                </div>
              ) : (
                recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.queueId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQueueSelect(rec.queueId)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      selectedQueue === rec.queueId
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCategoryIcon(rec.category)}</div>
                        <div>
                          <h3 className="text-white font-semibold">{rec.name}</h3>
                          <p className="text-sm text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {rec.location}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-sm font-semibold ${getScoreBg(rec.score)}`}>
                        <span className={getScoreColor(rec.score)}>{rec.score}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <Users className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <p className="text-xs text-gray-400">Queue</p>
                        <p className="text-sm font-semibold text-white">{rec.currentUsers}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <Timer className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <p className="text-xs text-gray-400">Wait</p>
                        <p className="text-sm font-semibold text-white">{rec.estimatedWait}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <p className="text-xs text-gray-400">Confidence</p>
                        <p className="text-sm font-semibold text-white capitalize">{rec.confidence}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-800/30 rounded-lg p-3">
                      {rec.isPeakHour && (
                        <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                      )}
                      {!rec.isPeakHour && (
                        <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="text-sm text-gray-300">{rec.recommendation}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/user-dashboard/join');
                      }}
                      className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all flex items-center justify-center gap-2"
                    >
                      Join Queue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Detailed Analytics Sidebar */}
        <div className="space-y-6">
          {/* Wait Time Prediction */}
          {waitPrediction && selectedQueue && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-900/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Wait Time Prediction</h3>
              </div>

              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-white mb-2">
                  {waitPrediction.estimatedWaitMinutes}
                  <span className="text-2xl text-gray-400 ml-1">min</span>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full border text-sm ${getConfidenceBadge(waitPrediction.confidence)}`}>
                  {waitPrediction.confidence} confidence
                </div>
              </div>

              {waitPrediction.range && (
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-400 mb-2">Historical Range</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Min</p>
                      <p className="text-lg font-semibold text-emerald-400">{waitPrediction.range.min}m</p>
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="h-2 bg-gradient-to-r from-emerald-500 to-orange-500 rounded-full" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-lg font-semibold text-orange-400">{waitPrediction.range.max}m</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Current Queue</span>
                  <span className="text-sm font-semibold text-white">{waitPrediction.currentQueueLength} people</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Data Points</span>
                  <span className="text-sm font-semibold text-white">{waitPrediction.historicalSamples} samples</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Peak Hours */}
          {peakHours.length > 0 && selectedQueue && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-900/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Peak Hours</h3>
              </div>

              <div className="space-y-2">
                {peakHours.slice(0, 3).map((peak, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{peak.timeRange}</p>
                        <p className="text-xs text-gray-400">{peak.day}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400">{peak.avgUsers}</p>
                      <p className="text-xs text-gray-500">avg users</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-900/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Quick Tips</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-300">Join queues during off-peak hours to save time</p>
              </div>
              <div className="flex items-start gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-300">Check wait predictions before joining</p>
              </div>
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-300">Higher scores indicate better times to join</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

