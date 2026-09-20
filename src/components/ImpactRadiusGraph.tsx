import React from 'react';
import { ImpactRadiusResult } from '../types';
import { AlertCircle, AlertTriangle, CheckCircle, ArrowDown, MapPin, Clock, DollarSign } from 'lucide-react';

interface ImpactRadiusGraphProps {
  impact: ImpactRadiusResult;
  onSelectActivity?: (activityId: string) => void;
}

export const ImpactRadiusGraph: React.FC<ImpactRadiusGraphProps> = ({ impact, onSelectActivity }) => {
  return (
    <div className="glass-card p-6 space-y-6">
      {/* Metrics Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Dynamic Topology</span>
          <h3 className="text-xl font-bold text-white mt-1">Impact Radius Assessment</h3>
          <p className="text-xs text-slate-400 mt-0.5">Root cause: {impact.root_cause}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-center">
            <div className="text-lg font-extrabold">{impact.direct_count}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider">Direct 🔴</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-center">
            <div className="text-lg font-extrabold">{impact.potential_count}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider">Potential 🟡</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center">
            <div className="text-lg font-extrabold">{impact.unaffected_count}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider">Unaffected 🟢</div>
          </div>
        </div>
      </div>

      {/* Visual Dependency Cascade */}
      <div className="space-y-6">
        {/* Tier 1: Directly Affected */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide">
              Directly Affected ({impact.directly_affected.length})
            </h4>
            <span className="text-xs text-slate-400">— Primary disruption failure point</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {impact.directly_affected.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-navy-950/40 rounded-xl">None identified</p>
            ) : (
              impact.directly_affected.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity?.(act.id)}
                  className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 hover:border-rose-400 cursor-pointer transition-all shadow-glow-rose/20"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase">
                        {act.category}
                      </span>
                      <h5 className="text-base font-bold text-white mt-1.5">{act.name}</h5>
                    </div>
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {act.start_time} - {act.end_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      ₹{act.estimated_cost}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Downstream Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Tier 2: Potentially Affected */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              Potentially Affected / Cascade ({impact.potentially_affected.length})
            </h4>
            <span className="text-xs text-slate-400">— Downstream dependencies or schedule shift</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {impact.potentially_affected.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-navy-950/40 rounded-xl">
                No cascading downstream disruption detected.
              </p>
            ) : (
              impact.potentially_affected.map((act) => (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity?.(act.id)}
                  className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase">
                        {act.category}
                      </span>
                      <h5 className="text-sm font-bold text-white mt-1">{act.name}</h5>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {act.start_time} - {act.end_time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Downstream Arrow */}
        <div className="flex justify-center text-slate-600">
          <ArrowDown className="w-5 h-5 text-emerald-500/40" />
        </div>

        {/* Tier 3: Unaffected */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
              Unaffected / Preserved ({impact.unaffected.length})
            </h4>
            <span className="text-xs text-slate-400">— Zero changes required</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {impact.unaffected.slice(0, 8).map((act) => (
              <div
                key={act.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-950/60 border border-slate-800 text-xs text-slate-300"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[180px]">{act.name}</span>
              </div>
            ))}
            {impact.unaffected.length > 8 && (
              <div className="px-3 py-1.5 rounded-lg bg-navy-950/60 border border-slate-800 text-xs text-slate-400">
                +{impact.unaffected.length - 8} more preserved
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
