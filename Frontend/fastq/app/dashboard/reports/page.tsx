'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, Filter, Eye, Mail, Printer, BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  generatedAt: string;
  status: 'ready' | 'generating' | 'failed';
  size: string;
  format: 'PDF' | 'Excel' | 'CSV';
}

export default function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  // Mock reports data
  const reports: Report[] = [
    {
      id: '1',
      name: 'Weekly Queue Performance Report',
      type: 'weekly',
      generatedAt: '2024-01-15 10:30',
      status: 'ready',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: '2',
      name: 'Monthly User Analytics',
      type: 'monthly',
      generatedAt: '2024-01-01 09:00',
      status: 'ready',
      size: '5.1 MB',
      format: 'Excel'
    },
    {
      id: '3',
      name: 'Daily Operations Summary',
      type: 'daily',
      generatedAt: '2024-01-14 18:00',
      status: 'ready',
      size: '1.2 MB',
      format: 'PDF'
    },
    {
      id: '4',
      name: 'Custom Queue Analysis',
      type: 'custom',
      generatedAt: '2024-01-13 14:15',
      status: 'generating',
      size: '0 MB',
      format: 'CSV'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-400/10';
      case 'generating': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FileText className="w-4 h-4 text-red-400" />;
      case 'Excel': return <BarChart3 className="w-4 h-4 text-green-400" />;
      case 'CSV': return <FileText className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Reports & Analytics</h1>
        <button className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Report Generation */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-100 mb-6">Generate New Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="custom">Custom Period</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="PDF">PDF Document</option>
              <option value="Excel">Excel Spreadsheet</option>
              <option value="CSV">CSV Data</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-sky-400" />
            </div>
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">{reports.length}</div>
          <div className="text-sm text-gray-400">Reports Generated</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400">Ready</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">
            {reports.filter(r => r.status === 'ready').length}
          </div>
          <div className="text-sm text-gray-400">Available</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs text-gray-400">Processing</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">
            {reports.filter(r => r.status === 'generating').length}
          </div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-1">12</div>
          <div className="text-sm text-gray-400">Reports</div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-100">Recent Reports</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{report.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <div className="flex items-center text-gray-400">
                      {getFormatIcon(report.format)}
                      <span className="ml-1 text-xs">{report.format}</span>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Generated: {new Date(report.generatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {report.size}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-600/50">
                <div className="flex items-center space-x-3">
                  {report.status === 'ready' && (
                    <>
                      <button className="bg-sky-600 text-white px-3 py-1 rounded-lg hover:bg-sky-700 transition-all text-sm flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      <button className="bg-gray-600 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-all text-sm flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>Preview</span>
                      </button>
                      <button className="bg-gray-600 text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-700 transition-all text-sm flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </button>
                    </>
                  )}
                  {report.status === 'generating' && (
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Generating...</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {report.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-lg font-semibold text-gray-100 mb-6">Report Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-100">User Activity Report</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Comprehensive analysis of user behavior and queue participation.</p>
            <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm">
              Use Template
            </button>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-medium text-gray-100">Wait Time Analysis</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Detailed breakdown of wait times and efficiency metrics.</p>
            <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all text-sm">
              Use Template
            </button>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-medium text-gray-100">Performance Dashboard</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Executive summary with key performance indicators.</p>
            <button className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-all text-sm">
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



