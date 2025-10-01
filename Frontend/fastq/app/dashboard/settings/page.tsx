'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Users, Database, Globe, Save, Trash2, Plus, Edit, Key, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [systemSettings, setSystemSettings] = useState({
    maxQueueSize: 50,
    defaultWaitTime: 15,
    autoCloseQueues: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [adminUsers] = useState([
    { id: '1', name: 'John Admin', email: 'john@admin.com', role: 'Super Admin', lastActive: '2 hours ago' },
    { id: '2', name: 'Sarah Manager', email: 'sarah@admin.com', role: 'Queue Manager', lastActive: '1 day ago' },
    { id: '3', name: 'Mike Staff', email: 'mike@admin.com', role: 'Staff', lastActive: '3 hours ago' }
  ]);

  const handleSystemSettingChange = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">System Settings</h1>

      {/* System Configuration */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-sky-500/20 rounded-lg">
            <Settings className="w-6 h-6 text-sky-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-100">System Configuration</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Max Queue Size</label>
            <input
              type="number"
              value={systemSettings.maxQueueSize}
              onChange={(e) => handleSystemSettingChange('maxQueueSize', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Default Wait Time (minutes)</label>
            <input
              type="number"
              value={systemSettings.defaultWaitTime}
              onChange={(e) => handleSystemSettingChange('defaultWaitTime', parseInt(e.target.value))}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300">Auto-close Empty Queues</p>
                <p className="text-sm text-gray-500">Automatically close queues when no users are waiting</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.autoCloseQueues}
                onChange={(e) => handleSystemSettingChange('autoCloseQueues', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300">Email Notifications</p>
                <p className="text-sm text-gray-500">Send system notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.emailNotifications}
                onChange={(e) => handleSystemSettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300">SMS Notifications</p>
                <p className="text-sm text-gray-500">Send critical alerts via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.smsNotifications}
                onChange={(e) => handleSystemSettingChange('smsNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Admin User Management */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-100">Admin Users</h2>
          </div>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-all flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {adminUsers.map((user) => (
            <div key={user.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{user.name}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mb-1">{user.email}</div>
                  <div className="text-gray-500 text-xs">Last active: {user.lastActive}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded-lg transition-all">
                    <Key className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-100">Security & Access</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              defaultValue={30}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password Policy</label>
            <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="standard">Standard (8+ characters)</option>
              <option value="strong">Strong (12+ characters, special chars)</option>
              <option value="enterprise">Enterprise (16+ characters, complexity)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-300">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Database & Backup */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-100">Database & Backup</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Automatic Backups</p>
              <p className="text-sm text-gray-500">Daily backup of system data</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Data Export</p>
              <p className="text-sm text-gray-500">Export all system data for migration</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
              Export Now
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400">System Reset</p>
              <p className="text-sm text-gray-500">Reset all data and settings (irreversible)</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all">
              Reset System
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
}



