'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, LayoutDashboard, List, BarChart3, CalendarDays, Settings, Menu, RefreshCcw, Bell, LogOut } from 'lucide-react';
import { AnimatedJoinButton } from '@/components/ui/animated-join-button';
import { FloatingJoinButton } from '@/components/floating-join-button';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    router.push('/');
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/user-dashboard' },
    { icon: List, label: 'My Queues', href: '/user-dashboard/my-queues' },
    { icon: BarChart3, label: 'Analytics', href: '/user-dashboard/analytics' },
    { icon: CalendarDays, label: 'History', href: '/user-dashboard/history' },
    { icon: Settings, label: 'Settings', href: '/user-dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-[rgba(15,15,15,0.7)] border-r border-[#1f1f1f] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen`}>
        <div className="flex h-screen flex-col">
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-2">
            
            <span className="logo-fastq-edgy text-white text-lg tracking-widest">FASTQ</span>
            <svg className="twinkle ml-1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H11L9 22L21 10H13L13 2Z" fill="#FACC15"/>
            </svg>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-gray-200">✕</button>
        </div>

        <nav className="mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                {/* Active indicator */}
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r ${isActive ? 'bg-sky-500' : 'bg-transparent group-hover:bg-sky-700/40'}`} />
                <div className={`grid place-items-center w-8 h-8 rounded-md border ${isActive ? 'border-sky-600 bg-sky-600/10 text-sky-400' : 'border-[#1f1f1f] bg-[#111] group-hover:border-[#2a2a2a]'}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                <span className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(120px_80px_at_var(--x,50%)_var(--y,50%),rgba(59,130,246,0.12),transparent_60%)]" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-5 border-t border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 grid place-items-center text-white text-sm font-semibold">U</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-100">User</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-200">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,10,10,0.6)] border-b border-[#1f1f1f] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md border border-[#1f1f1f] bg-[#0f0f0f] text-gray-400 hover:text-gray-200">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base md:text-lg font-semibold text-white">
                {sidebarItems.find(i => i.href === pathname)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md border border-[#1f1f1f] bg-[#0f0f0f] text-gray-400 hover:text-gray-200">
                <RefreshCcw className="w-5 h-5" />
              </button>
              <button className="relative p-2 rounded-md border border-[#1f1f1f] bg-[#0f0f0f] text-gray-400 hover:text-gray-200">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
              </button>
              {/* Join removed from top bar as requested */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <FloatingJoinButton onClick={() => router.push('/user-dashboard/join')} />
    </div>
  );
}




