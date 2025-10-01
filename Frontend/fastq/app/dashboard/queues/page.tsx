'use client';

import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Users, Clock, Play, Pause, Settings, Trash2, Edit } from 'lucide-react';

interface Queue {
  id: string;
  name: string;
  location: string;
  category: string;
  status: 'active' | 'paused' | 'inactive';
  currentUsers: number;
  maxUsers: number;
  avgWaitTime: string;
  lastUpdated: string;
}

export default function AdminQueuesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock queue data
  const queues: Queue[] = [
    {
      id: '1',
      name: 'Cafeteria Main Counter',
      location: 'Building A, Ground Floor',
      category: 'Food',
      status: 'active',
      currentUsers: 12,
      maxUsers: 50,
      avgWaitTime: '15 min',
      lastUpdated: '2 min ago'
    },
    {
      id: '2',
      name: 'Medical Center',
      location: 'Health Services Building',
      category: 'Medical',
      status: 'active',
      currentUsers: 8,
      maxUsers: 30,
      avgWaitTime: '25 min',
      lastUpdated: '1 min ago'
    },
    {
      id: '3',
      name: 'Student Services',
      location: 'Administrative Building',
      category: 'Admin',
      status: 'paused',
      currentUsers: 5,
      maxUsers: 20,
      avgWaitTime: '10 min',
      lastUpdated: '5 min ago'
    },
    {
      id: '4',
      name: 'Library Services',
      location: 'Main Library',
      category: 'Admin',
      status: 'active',
      currentUsers: 3,
      maxUsers: 15,
      avgWaitTime: '8 min',
      lastUpdated: '3 min ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      case 'inactive': return 'text-red-400 bg-red-400/10';
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

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         queue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || queue.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Queue Management</h1>
        <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all flex items-center space-x-2">
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
              <option value="Food">Food</option>
              <option value="Medical">Medical</option>
              <option value="Admin">Admin</option>
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
          <div className="text-sm text-gray-400">Active Queues</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Current</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">
            {queues.reduce((sum, queue) => sum + queue.currentUsers, 0)}
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
          <div className="text-2xl font-bold text-gray-100 mb-1">18m</div>
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
                <div className="text-gray-400 text-sm mb-4">{queue.location}</div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-sky-400">{queue.currentUsers}</div>
                    <div className="text-xs text-gray-400">Current Users</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-green-400">{queue.maxUsers}</div>
                    <div className="text-xs text-gray-400">Max Capacity</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-yellow-400">{queue.avgWaitTime}</div>
                    <div className="text-xs text-gray-400">Avg Wait Time</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-purple-400">{queue.lastUpdated}</div>
                    <div className="text-xs text-gray-400">Last Updated</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center space-x-3">
                {queue.status === 'active' ? (
                  <button className="bg-yellow-600/20 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-600/30 transition-all text-sm flex items-center space-x-2">
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button className="bg-green-600/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-600/30 transition-all text-sm flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Resume</span>
                  </button>
                )}
                <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                  View Details
                </button>
                <button className="bg-gray-700/50 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all text-sm">
                  Manage Users
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Queue ID: {queue.id}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQueues.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Queues Found</h3>
          <p className="text-gray-400 mb-6">No queues match your search criteria.</p>
          <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all">
            Create New Queue
          </button>
        </div>
      )}
    </div>
  );
}



