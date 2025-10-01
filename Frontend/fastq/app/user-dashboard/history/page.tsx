'use client';

import { Clock, MapPin, Star, CheckCircle, XCircle, Filter, Calendar, Download } from 'lucide-react';

interface QueueHistory {
  id: string;
  name: string;
  location: string;
  category: string;
  joinedAt: string;
  completedAt: string;
  waitTime: string;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number;
  position: number;
}

export default function HistoryPage() {
  // Mock history data
  const historyData: QueueHistory[] = [
    {
      id: '1',
      name: 'Cafeteria Main Counter',
      location: 'Building A, Ground Floor',
      category: 'Food',
      joinedAt: '2024-01-14 12:30',
      completedAt: '2024-01-14 12:45',
      waitTime: '15 min',
      status: 'completed',
      rating: 4,
      position: 3
    },
    {
      id: '2',
      name: 'Medical Center',
      location: 'Health Services Building',
      category: 'Medical',
      joinedAt: '2024-01-13 09:15',
      completedAt: '2024-01-13 09:35',
      waitTime: '20 min',
      status: 'completed',
      rating: 5,
      position: 2
    },
    {
      id: '3',
      name: 'Library Services',
      location: 'Main Library',
      category: 'Admin',
      joinedAt: '2024-01-12 14:20',
      completedAt: '2024-01-12 14:25',
      waitTime: '5 min',
      status: 'completed',
      rating: 4,
      position: 1
    },
    {
      id: '4',
      name: 'Student Services',
      location: 'Administrative Building',
      category: 'Admin',
      joinedAt: '2024-01-11 10:00',
      completedAt: '2024-01-11 10:00',
      waitTime: '0 min',
      status: 'cancelled',
      position: 5
    },
    {
      id: '5',
      name: 'Bookstore',
      location: 'Student Center',
      category: 'Admin',
      joinedAt: '2024-01-10 16:30',
      completedAt: '2024-01-10 16:50',
      waitTime: '20 min',
      status: 'completed',
      rating: 3,
      position: 4
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'no-show': return <XCircle className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      case 'no-show': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Food': return 'text-orange-400 bg-orange-400/10';
      case 'Medical': return 'text-red-400 bg-red-400/10';
      case 'Admin': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const totalQueues = historyData.length;
  const completedQueues = historyData.filter(q => q.status === 'completed').length;
  const averageRating = historyData
    .filter(q => q.rating)
    .reduce((acc, q) => acc + (q.rating || 0), 0) / historyData.filter(q => q.rating).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Queue History</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-700/50 text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-700 transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{totalQueues}</div>
          <div className="text-sm text-gray-400">Queues Joined</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{completedQueues}</div>
          <div className="text-sm text-gray-400">Success Rate: {Math.round((completedQueues / totalQueues) * 100)}%</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-gray-400">Average</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{averageRating.toFixed(1)}</div>
          <div className="text-sm text-gray-400">Rating</div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyData.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No History Yet</h3>
            <p className="text-gray-400">Your queue history will appear here once you start using the system.</p>
          </div>
        ) : (
          historyData.map((queue) => (
            <div key={queue.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{queue.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(queue.category)}`}>
                      {queue.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                      {queue.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {queue.location}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Joined:</span>
                      <div className="text-gray-300">{new Date(queue.joinedAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Completed:</span>
                      <div className="text-gray-300">{new Date(queue.completedAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Wait Time:</span>
                      <div className="text-gray-300">{queue.waitTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Position:</span>
                      <div className="text-gray-300">#{queue.position}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(queue.status)}
                  {queue.rating && (
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm">{queue.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {queue.status === 'completed' && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-4">
                    <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                      View Details
                    </button>
                    <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                      Rate Service
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Completed at {new Date(queue.completedAt).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {historyData.length > 0 && (
        <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
          <div className="text-sm text-gray-400">
            Showing 1-{historyData.length} of {historyData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm">
              Previous
            </button>
            <button className="px-3 py-1 bg-sky-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all text-sm">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


