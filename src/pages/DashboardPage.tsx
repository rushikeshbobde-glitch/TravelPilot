import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  DollarSign,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Radar,
  ArrowRight,
  ShieldCheck,
  Compass,
  Zap,
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { BudgetEngine } from '../services/budgetEngine';
import { StatCard } from '../components/StatCard';
import { PriorityBadge } from '../components/PriorityBadge';

export const DashboardPage: React.FC = () => {
  const { activeTrip, activeDisruptions, changeLogs, risks, simulateDisruption } = useTrip();
  const navigate = useNavigate();

  const budgetSummary = BudgetEngine.calculateBudget(activeTrip);
  const totalActivities = (activeTrip.days || []).reduce((acc, d) => acc + d.activities.length, 0);

  // Today's activities (Day 1 or Day 2)
  const today = (activeTrip.days || [])[1] || (activeTrip.days || [])[0];
  const upcomingActs = today?.activities || [];
  const nextActivity = upcomingActs[0];

  const handleSimulateDemo = () => {
    simulateDisruption('VENUE_CLOSURE');
    navigate('/disruptions');
  };

  return (
    <div className="space-y-8">
      {/* Trip Hero Card */}
      <div className="glass-card p-6 sm:p-8 border-brand-500/30 shadow-glow relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
                ACTIVE DIGITAL TWIN
              </span>
              <span className="text-xs text-slate-400">
                {activeTrip.start_date} – {activeTrip.end_date} (4 Days)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
              {activeTrip.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {activeTrip.destination}
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                {activeTrip.travel_style} Style
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {totalActivities} Scheduled Sights
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/assistant')}
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Ask TravelPilot AI
            </button>
            <button
              onClick={handleSimulateDemo}
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-glow bg-gradient-to-r from-amber-500 to-rose-500"
            >
              <Zap className="w-4 h-4" />
              Simulate Museum Closure
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Budget"
          value={BudgetEngine.formatCurrency(budgetSummary.total_budget, activeTrip.currency)}
          subtitle={`${budgetSummary.utilization_percentage}% utilized`}
          icon={DollarSign}
          color="cyan"
          badge={`₹${budgetSummary.remaining_budget.toLocaleString()} remaining`}
          onClick={() => navigate('/budget')}
        />
        <StatCard
          title="Next Scheduled Item"
          value={nextActivity ? nextActivity.name.slice(0, 18) + '...' : 'Free Time'}
          subtitle={nextActivity ? `${nextActivity.start_time} - ${nextActivity.end_time}` : 'No events'}
          icon={Clock}
          color="emerald"
          badge={nextActivity?.category || 'Leisure'}
          onClick={() => navigate('/itinerary')}
        />
        <StatCard
          title="Trip Health & Risk"
          value={risks.length > 0 ? `${risks.length} Monitored` : 'Optimal'}
          subtitle="Real-time telemetry"
          icon={Radar}
          color="amber"
          badge="Weather & Transit Active"
          onClick={() => navigate('/risk-radar')}
        />
        <StatCard
          title="Disruptions Resolved"
          value={changeLogs.length}
          subtitle="Autonomous self-heals"
          icon={CheckCircle2}
          color="purple"
          badge="Zero manual replanning"
          onClick={() => navigate('/disruptions')}
        />
      </div>

      {/* Main Grid: Today's Timeline + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule for Today */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Day {today?.day_number || 1} Schedule
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{today?.theme || 'Curated Sights'}</h2>
            </div>
            <button
              onClick={() => navigate('/itinerary')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              Full 4-Day Timeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingActs.map((act, index) => (
              <div
                key={act.id}
                className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  act.status === 'replaced'
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-16 text-center py-2 rounded-xl bg-navy-950 border border-slate-800 shrink-0">
                    <span className="text-xs font-black text-white">{act.start_time}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{act.end_time}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{act.name}</h3>
                      <PriorityBadge priority={act.priority} />
                      {act.status === 'replaced' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AUTO-HEALED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{act.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <span className="font-semibold text-slate-300">₹{act.estimated_cost}</span>
                  <span className="px-2 py-1 rounded-lg bg-navy-950 text-[11px] font-medium text-slate-400">
                    {act.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Risk Telemetry & Recent Changes */}
        <div className="space-y-6">
          {/* Risk Radar Summary */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Active Risk Radar</h3>
              </div>
              <button
                onClick={() => navigate('/risk-radar')}
                className="text-[11px] font-semibold text-cyan-400 hover:underline"
              >
                View Radar
              </button>
            </div>

            <div className="space-y-2.5">
              {risks.slice(0, 2).map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-navy-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                      {r.type} RISK
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {Math.round(r.probability * 100)}% prob
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white mt-1">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Heal Change Log */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Recent Trip Changes</h3>
              </div>
              <button
                onClick={() => navigate('/disruptions')}
                className="text-[11px] font-semibold text-cyan-400 hover:underline"
              >
                Full History
              </button>
            </div>

            {changeLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">
                No disruptions yet. Your trip is fully on track!
              </p>
            ) : (
              <div className="space-y-2.5">
                {changeLogs.slice(0, 2).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-300 uppercase">
                        {log.change_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200">{log.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
