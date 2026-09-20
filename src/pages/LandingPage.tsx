import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Plane,
  ShieldCheck,
  RefreshCw,
  Clock,
  Compass,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleDemoLaunch = async () => {
    await login('demo@travelpilot.app');
    navigate('/dashboard');
  };

  const featureCards = [
    {
      icon: Sparkles,
      title: 'AI Trip Planning',
      desc: 'Creates realistic, day-by-day itineraries tailored to your budget, style, transit, and weighted interests.',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      icon: RefreshCw,
      title: 'Self-Healing Itinerary',
      desc: 'When flights delay or museums close, TravelPilot automatically finds optimal replacements and heals your plan.',
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    },
    {
      icon: AlertTriangle,
      title: 'Impact Radius Engine',
      desc: 'Identifies directly affected, potentially affected, and unaffected activities across your travel dependency graph.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'Risk Radar',
      desc: 'Predictively monitors coastal weather squalls, transit lag, and booking risks before they disrupt your day.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Engine',
      desc: 'Deterministic tracking of accommodation, transport, meals, and activities with automatic reallocation.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Zap,
      title: 'Explainable AI',
      desc: 'Every replanned change delivers transparent reasoning: cost difference, distance, and priority preservation.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan text-white shadow-glow">
            <Plane className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
            TRAVEL<span className="text-accent-cyan">PILOT</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2"
          >
            Log In
          </button>
          <button
            onClick={handleDemoLaunch}
            className="btn-primary text-xs py-2 px-4 shadow-glow"
          >
            Launch Demo App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Autonomous Travel Architecture
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] font-['Outfit']">
            Your Trip That <br />
            <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-teal bg-clip-text text-transparent">
              Heals Itself.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Traditional itineraries break when flights delay or venues close. TravelPilot builds a connected{' '}
            <strong className="text-white font-semibold">Travel Digital Twin</strong> that actively detects disruptions,
            maps the impact radius, and autonomously repairs your schedule.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/plan')}
              className="w-full sm:w-auto btn-primary text-sm py-3.5 px-8 flex items-center justify-center gap-2 shadow-glow"
            >
              <Compass className="w-4 h-4" />
              PLAN MY TRIP
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoLaunch}
              className="w-full sm:w-auto btn-secondary text-sm py-3.5 px-8 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              VIEW GOA DEMO (₹25k)
            </button>
          </div>
        </div>

        {/* Live Visual Flow Diagram Card */}
        <div className="max-w-4xl mx-auto mt-16 glass-card p-6 sm:p-8 border-brand-500/30 shadow-glow">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Trip Health Lifecycle
              </span>
            </div>
            <span className="text-xs text-slate-400">Zero Manual Rescheduling</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-400">1. INPUT</div>
              <div className="text-sm font-extrabold text-white mt-1">Preferences</div>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
              <div className="text-xs font-bold text-cyan-400">2. TWIN</div>
              <div className="text-sm font-extrabold text-white mt-1">Connected Graph</div>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40">
              <div className="text-xs font-bold text-rose-400">3. DISRUPTION</div>
              <div className="text-sm font-extrabold text-rose-200 mt-1">Impact Radius 🔴</div>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
              <div className="text-xs font-bold text-emerald-400">4. SELF-HEAL</div>
              <div className="text-sm font-extrabold text-emerald-200 mt-1">Auto-Replanned 🟢</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-white font-['Outfit']">
            Engineered for Continuous Trip Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every feature is backed by deterministic scoring, real-time constraints, and explainable AI logic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card glass-card-hover p-6">
                <div className={`p-3 rounded-2xl w-fit border ${f.color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hackathon Demo Scenario Preview */}
      <section className="max-w-5xl mx-auto px-6 py-12 mb-16">
        <div className="glass-card p-8 border-brand-500/40 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Hackathon Golden Scenario
              </span>
              <h3 className="text-2xl font-black text-white">Goa 4-Day Escape with Museum Closure</h3>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Test the full E2E workflow: Simulate a sudden Archaeological Museum closure, view the 3-tier Impact Radius,
                and watch the Self-Healing engine select Goa State Museum while preserving the ₹25k budget and your high history priority.
              </p>
            </div>
            <button
              onClick={handleDemoLaunch}
              className="btn-primary text-xs py-3 px-6 whitespace-nowrap shadow-glow"
            >
              Run Golden Demo Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 TravelPilot. Autonomous Self-Healing Travel Platform. Built for Hackathon MVP.</p>
      </footer>
    </div>
  );
};
