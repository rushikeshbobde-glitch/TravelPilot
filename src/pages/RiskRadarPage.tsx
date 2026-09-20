import React from 'react';
import { useTrip } from '../context/TripContext';
import {
  Radar,
  CloudRain,
  Car,
  Landmark,
  Calendar,
  DollarSign,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const RiskRadarPage: React.FC = () => {
  const { risks } = useTrip();

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'WEATHER':
        return CloudRain;
      case 'TRANSPORT':
        return Car;
      case 'ACTIVITY':
        return Landmark;
      case 'BOOKING':
        return Briefcase;
      case 'SCHEDULE':
        return Calendar;
      default:
        return DollarSign;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'border-rose-500/40 bg-rose-950/20 text-rose-300';
      case 'MEDIUM':
        return 'border-amber-500/40 bg-amber-950/20 text-amber-300';
      default:
        return 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radar className="w-4 h-4 text-cyan-400" />
            Predictive Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-1">
            Travel Risk Radar
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Sentinel Active (Score: 92/100)</span>
        </div>
      </div>

      {/* Overview Radar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {risks.map((r) => {
          const Icon = getRiskIcon(r.type);
          const colorClass = getLevelColor(r.level);

          return (
            <div
              key={r.id}
              className={`glass-card p-6 flex flex-col justify-between space-y-4 border ${colorClass} transition-all hover:shadow-glow/30`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClass}`}>
                    {r.level} RISK ({Math.round(r.probability * 100)}%)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {r.type} HAZARD
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{r.description}</h3>
                </div>

                <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800/80 space-y-1 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Impact</span>
                  <p className="font-semibold text-slate-200">{r.impact}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px] uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Recommended Mitigation
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{r.recommendation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
