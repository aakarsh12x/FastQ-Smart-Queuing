'use client';

import { Activity, TrendingUp, Clock, Users, Star, Award, Calendar, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  // Mock analytics data
  const stats = {
    totalQueues: 24,
    totalWaitTime: '8h 32m',
    averageRating: 4.2,
    timeSaved: '2h 15m'
  };

  const weeklyData = [
    { day: 'Mon', queues: 3, waitTime: 45 },
    { day: 'Tue', queues: 5, waitTime: 67 },
    { day: 'Wed', queues: 4, waitTime: 52 },
    { day: 'Thu', queues: 6, waitTime: 78 },
    { day: 'Fri', queues: 4, waitTime: 41 },
    { day: 'Sat', queues: 2, waitTime: 23 },
    { day: 'Sun', queues: 0, waitTime: 0 }
  ];

  const categoryStats = [
    { name: 'Food', count: 12, avgWait: 25, color: 'bg-orange-500' },
    { name: 'Medical', count: 6, avgWait: 45, color: 'bg-red-500' },
    { name: 'Admin', count: 4, avgWait: 15, color: 'bg-blue-500' },
    { name: 'Library', count: 2, avgWait: 8, color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Analytics</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.totalQueues}</div>
          <div className="text-sm text-gray-400">Queues Joined</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.totalWaitTime}</div>
          <div className="text-sm text-gray-400">Wait Time</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Star className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.averageRating}</div>
          <div className="text-sm text-gray-400">Rating</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400">Saved</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.timeSaved}</div>
          <div className="text-sm text-gray-400">Time Saved</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Weekly Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-400">{day.day}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(day.queues / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 w-16 text-right">
                  {day.queues} queues
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wait Time Trends */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Wait Time Trends</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-400">{day.day}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(day.waitTime / 80) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 w-16 text-right">
                  {day.waitTime}m
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-100">Queue Categories</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((category, index) => (
            <div key={category.name} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-100">{category.name}</h4>
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Queues</span>
                  <span className="text-gray-100">{category.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg Wait</span>
                  <span className="text-gray-100">{category.avgWait}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <h4 className="font-medium text-gray-100">Early Bird</h4>
                <p className="text-sm text-gray-400">Joined 5 queues before 9 AM</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="font-medium text-gray-100">Top Rater</h4>
                <p className="text-sm text-gray-400">Rated 10+ services this month</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="font-medium text-gray-100">Time Saver</h4>
                <p className="text-sm text-gray-400">Saved 2+ hours this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


