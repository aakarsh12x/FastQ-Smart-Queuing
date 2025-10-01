'use client';

import { Clock, Users, MapPin, Phone, Star, MoreVertical } from 'lucide-react';

interface JoinedQueue {
  id: string;
  name: string;
  location: string;
  category: string;
  position: number;
  totalPeople: number;
  estimatedWait: string;
  status: 'waiting' | 'served' | 'cancelled';
  joinedAt: string;
  rating?: number;
}

export default function MyQueuesPage() {
  // Mock data for joined queues
  const joinedQueues: JoinedQueue[] = [
    {
      id: '1',
      name: 'Cafeteria Main Counter',
      location: 'Building A, Ground Floor',
      category: 'Food',
      position: 3,
      totalPeople: 12,
      estimatedWait: '15 min',
      status: 'waiting',
      joinedAt: '2024-01-15 10:30',
      rating: 4
    },
    {
      id: '2',
      name: 'Student Services',
      location: 'Administrative Building',
      category: 'Admin',
      position: 1,
      totalPeople: 5,
      estimatedWait: '5 min',
      status: 'waiting',
      joinedAt: '2024-01-15 11:15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-400 bg-yellow-400/10';
      case 'served': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">My Queues</h1>
        <div className="text-sm text-gray-400">
          {joinedQueues.length} active queue{joinedQueues.length !== 1 ? 's' : ''}
        </div>
      </div>

      {joinedQueues.length === 0 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Active Queues</h3>
          <p className="text-gray-400 mb-6">You haven't joined any queues yet. Browse available queues to get started!</p>
          <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all">
            Browse Queues
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {joinedQueues.map((queue) => (
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
                  <div className="text-xs text-gray-500">
                    Joined: {new Date(queue.joinedAt).toLocaleString()}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-sky-400">#{queue.position}</div>
                  <div className="text-xs text-gray-400">Your Position</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{queue.totalPeople}</div>
                  <div className="text-xs text-gray-400">Total People</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{queue.estimatedWait}</div>
                  <div className="text-xs text-gray-400">Est. Wait Time</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-all text-sm">
                    Leave Queue
                  </button>
                  <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                    View Details
                  </button>
                </div>
                {queue.rating && (
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm">{queue.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Joined Cafeteria Main Counter</span>
            </div>
            <span className="text-gray-500 text-xs">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Completed Library Services queue</span>
            </div>
            <span className="text-gray-500 text-xs">Yesterday</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Rated Medical Center 5 stars</span>
            </div>
            <span className="text-gray-500 text-xs">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}


