'use client';

import { BarChart3, TrendingUp, Users, Clock, Star, Activity, Calendar, Download } from 'lucide-react';

export default function AdminAnalyticsPage() {
  // Mock analytics data
  const stats = {
    totalUsers: 1247,
    totalQueues: 8,
    avgWaitTime: '18m',
    satisfaction: 4.3
  };

  const hourlyData = [
    { hour: '8AM', users: 45, waitTime: 12 },
    { hour: '9AM', users: 78, waitTime: 18 },
    { hour: '10AM', users: 92, waitTime: 22 },
    { hour: '11AM', users: 156, waitTime: 28 },
    { hour: '12PM', users: 234, waitTime: 35 },
    { hour: '1PM', users: 198, waitTime: 32 },
    { hour: '2PM', users: 167, waitTime: 25 },
    { hour: '3PM', users: 134, waitTime: 20 },
    { hour: '4PM', users: 89, waitTime: 15 },
    { hour: '5PM', users: 67, waitTime: 12 }
  ];

  const queuePerformance = [
    { name: 'Cafeteria Main', users: 234, avgWait: 15, satisfaction: 4.2 },
    { name: 'Medical Center', users: 156, avgWait: 25, satisfaction: 4.5 },
    { name: 'Student Services', users: 89, avgWait: 12, satisfaction: 4.1 },
    { name: 'Library Services', users: 67, avgWait: 8, satisfaction: 4.3 }
  ];

  const categoryStats = [
    { name: 'Food', queues: 3, users: 456, avgWait: 18, color: 'bg-orange-500' },
    { name: 'Medical', queues: 2, users: 234, avgWait: 28, color: 'bg-red-500' },
    { name: 'Admin', queues: 3, users: 189, avgWait: 12, color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Analytics Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </button>
          <button className="flex items-center space-x-2 bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <Users className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Users Served</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.totalQueues}</div>
          <div className="text-sm text-gray-400">Queues</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-gray-400">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.avgWaitTime}</div>
          <div className="text-sm text-gray-400">Wait Time</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400">Rating</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{stats.satisfaction}</div>
          <div className="text-sm text-gray-400">Satisfaction</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-100">Hourly Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {hourlyData.map((data, index) => (
              <div key={data.hour} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-400">{data.hour}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.users / 250) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 w-20 text-right">
                  {data.users} users
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
          <div className="space-y-3">
            {hourlyData.map((data, index) => (
              <div key={data.hour} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-400">{data.hour}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.waitTime / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 w-16 text-right">
                  {data.waitTime}m
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Queue Performance */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-100">Queue Performance</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {queuePerformance.map((queue, index) => (
            <div key={queue.name} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-100">{queue.name}</h4>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm">{queue.satisfaction}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Users:</span>
                  <div className="text-gray-100 font-medium">{queue.users}</div>
                </div>
                <div>
                  <span className="text-gray-400">Avg Wait:</span>
                  <div className="text-gray-100 font-medium">{queue.avgWait}m</div>
                </div>
                <div>
                  <span className="text-gray-400">Efficiency:</span>
                  <div className="text-gray-100 font-medium">
                    {Math.round((queue.users / queue.avgWait) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Category Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryStats.map((category, index) => (
            <div key={category.name} className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-100">{category.name}</h4>
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Queues</span>
                  <span className="text-gray-100">{category.queues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Users</span>
                  <span className="text-gray-100">{category.users}</span>
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

      {/* Insights */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-6">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
            <h4 className="font-medium text-gray-100 mb-2">Peak Hours</h4>
            <p className="text-sm text-gray-400">12PM-1PM shows highest user activity with 234 users and 35min average wait time.</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="font-medium text-gray-100 mb-2">Efficiency</h4>
            <p className="text-sm text-gray-400">Library Services has the best efficiency ratio with 8min average wait time.</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
            <h4 className="font-medium text-gray-100 mb-2">Satisfaction</h4>
            <p className="text-sm text-gray-400">Medical Center leads in user satisfaction with 4.5/5 rating.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg p-4 border border-purple-500/30">
            <h4 className="font-medium text-gray-100 mb-2">Recommendations</h4>
            <p className="text-sm text-gray-400">Consider adding more staff during 12PM-1PM peak hours to reduce wait times.</p>
          </div>
        </div>
      </div>
    </div>
  );
}



