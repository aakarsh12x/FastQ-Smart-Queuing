'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Users, BarChart3, CheckCircle, ArrowRight, User, Lock, Mail } from 'lucide-react';
import { WavyBackground } from '@/components/ui/wavy-background';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data?.error || 'Login failed');
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.user?.role || 'user');
        }
        const role = (data.user?.role as 'user' | 'admin') || userType;
        router.push(role === 'admin' ? '/dashboard' : '/user-dashboard');
        return;
      }

      // Register - Add validation
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      console.log('Registration attempt:', { name: fullName.trim(), email: email.trim(), password, role: userType });

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName.trim(), email: email.trim(), password, role: userType })
      });
      const data = await res.json();
      console.log('Registration response:', { status: res.status, data });
      if (!res.ok || !data.success) {
        const errorMsg = data?.errors?.[0]?.msg || data?.error || 'Registration failed';
        console.error('Registration error:', errorMsg);
        throw new Error(errorMsg);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user?.role || userType);
      }
      router.push(userType === 'admin' ? '/dashboard' : '/user-dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <WavyBackground
      colors={['#0ea5e9', '#3b82f6', '#06b6d4']}
      waveWidth={40}
      backgroundFill="rgb(10, 10, 10)"
      blur={8}
      speed="slow"
      waveOpacity={0.2}
      containerClassName="min-h-screen w-full"
    >
      {/* Header (logo removed as requested) */}
      <header className="absolute top-0 w-full p-6 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="h-9" />
        </div>
      </header>

      <div className="flex min-h-screen w-full relative z-10">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-lg animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-sky-900/30 text-sky-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                <span>Smart Queue Management</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Skip the wait,{' '}
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                  not the line
                </span>{' '}with <span className="logo-font">fastq</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Real-time queue management for canteens, hospitals, and offices. 
                Join virtual queues, track your position, and get notified when it's your turn.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Virtual Queues</h3>
                  <p className="text-sm text-gray-400">Join from anywhere</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Real-time Updates</h3>
                  <p className="text-sm text-gray-400">Live position tracking</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Analytics</h3>
                  <p className="text-sm text-gray-400">Queue insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Smart Predictions</h3>
                  <p className="text-sm text-gray-400">Wait time estimates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative z-10 w-full">
          <div className="w-full max-w-md animate-fade-in">
            <div className="glass-card rounded-2xl p-6">
              {/* User Type Toggle */}
              <div className="flex bg-slate-800 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setUserType('user')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    userType === 'user'
                      ? 'bg-slate-700 text-sky-300 shadow-sm'
                      : 'text-gray-400'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  User
                </button>
                <button
                  onClick={() => setUserType('admin')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    userType === 'admin'
                      ? 'bg-slate-700 text-sky-300 shadow-sm'
                      : 'text-gray-400'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Admin
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome back' : 'Get started'}
                </h2>
                <p className="text-gray-400">
                  {isLogin 
                    ? `Sign in to your ${userType} account` 
                    : `Create your ${userType} account`
                  }
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        minLength={2}
                        maxLength={50}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-white transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-slate-800 text-white transition-colors"
                      required
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-600 text-sky-500 focus:ring-sky-500" />
                      <span className="ml-2 text-sm text-gray-400">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-sky-400 hover:text-sky-300">
                      Forgot password?
                    </a>
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-400">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-sky-700 hover:to-blue-700 focus:ring-4 focus:ring-sky-500/50 transition-all duration-200 flex items-center justify-center group"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-sky-400 hover:text-sky-300 font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {/* Demo credentials removed */}
            </div>
          </div>
        </div>
    </div>
    </WavyBackground>
  );
}
