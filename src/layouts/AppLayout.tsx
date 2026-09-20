import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Calendar,
  Map as MapIcon,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Radar,
  Sparkles,
  Sliders,
  Settings,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Plane,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { DisruptionBanner } from '../components/DisruptionBanner';
import { ExplainableChangeModal } from '../components/ExplainableChangeModal';

export const AppLayout: React.FC = () => {
  const { user, logout, isDemoMode } = useAuth();
  const { trips, activeTrip, setActiveTripId, lastHealingResult } = useTrip();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/plan', label: 'Plan New Trip', icon: PlusCircle },
    { to: '/itinerary', label: 'Itinerary', icon: Calendar },
    { to: '/map', label: 'Interactive Map', icon: MapIcon },
    { to: '/budget', label: 'Smart Budget', icon: DollarSign },
    { to: '/bookings', label: 'Bookings Hub', icon: Briefcase },
    { to: '/disruptions', label: 'Disruption Center', icon: AlertTriangle, badge: 'Self-Heal' },
    { to: '/risk-radar', label: 'Risk Radar', icon: Radar },
    { to: '/what-if', label: 'What-If Simulator', icon: Sliders },
    { to: '/assistant', label: 'AI Assistant', icon: Sparkles },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-navy-900/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 lg:hidden rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan text-white shadow-glow group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 font-['Outfit']">
                TRAVEL<span className="text-accent-cyan">PILOT</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide -mt-1">
                Your Trip That Heals Itself
              </span>
            </div>
          </div>
        </div>

        {/* Center: Trip Selector */}
        <div className="hidden md:flex items-center gap-2">
          {trips.length > 0 && (
            <div className="relative">
              <select
                value={activeTrip?.id}
                onChange={(e) => setActiveTripId(e.target.value)}
                className="bg-navy-950 border border-slate-700/80 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-400 cursor-pointer"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id} className="bg-navy-900">
                    📍 {t.name} ({t.destination})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Demo indicator, User Profile */}
        <div className="flex items-center gap-3">
          {isDemoMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              DEMO MODE
            </div>
          )}

          {lastHealingResult && (
            <button
              onClick={() => setShowExplainModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-brand-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:brightness-110 shadow-glow-amber/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Explainable AI
            </button>
          )}

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white">{user?.full_name || 'Traveler'}</p>
              <p className="text-[10px] text-slate-400">{user?.email}</p>
            </div>
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                {user?.full_name?.charAt(0) || 'T'}
              </div>
            )}
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Disruption Alert Banner */}
      <DisruptionBanner />

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-navy-900 border-r border-slate-800/80 p-4 transform transition-transform duration-200 lg:translate-x-0 lg:static flex flex-col justify-between ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Trip Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-500/15 border border-brand-500/30 text-brand-300 shadow-glow/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Disruption Trigger Shortcut */}
          <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Self-Healing Demo</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Trigger instant simulation scenarios from Disruption Center to watch the AI heal live.
            </p>
            <button
              onClick={() => {
                setSidebarOpen(false);
                navigate('/disruptions');
              }}
              className="w-full btn-primary text-xs py-1.5"
            >
              Open Disruption Hub
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Explainable AI Modal */}
      {showExplainModal && lastHealingResult && (
        <ExplainableChangeModal
          result={lastHealingResult}
          onClose={() => setShowExplainModal(false)}
        />
      )}
    </div>
  );
};
