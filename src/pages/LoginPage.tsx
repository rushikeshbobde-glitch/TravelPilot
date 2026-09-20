import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('demo@travelpilot.app');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const { login, isDemoMode, toggleDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoadingState(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoadingState(false);
    }
  };

  const handleQuickDemo = async () => {
    toggleDemoMode(true);
    await login('demo@travelpilot.app', 'password123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan text-white shadow-glow mb-4">
          <Plane className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight font-['Outfit']">
          Welcome to <span className="text-accent-cyan">TravelPilot</span>
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Sign in to access your self-healing travel digital twin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-card p-8 shadow-2xl border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-input w-full pl-10"
                  placeholder="traveler@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-cyan-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="glass-input w-full pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingState}
              className="w-full btn-primary text-xs py-3 mt-2 flex items-center justify-center gap-2 shadow-glow"
            >
              {loadingState ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Instant Login Button */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              1-Click Demo Login (Pre-Loaded Goa Trip)
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-400 font-bold hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
