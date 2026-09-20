import React from 'react';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

export const DisruptionBanner: React.FC = () => {
  const { activeDisruptions, simulateDisruption } = useTrip();
  const navigate = useNavigate();

  if (!activeDisruptions || activeDisruptions.length === 0) return null;

  const current = activeDisruptions[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-amber-950/60 to-navy-900/90 border-b border-rose-500/30 px-4 py-3 sticky top-16 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 uppercase tracking-wider">
                {current.severity} DISRUPTION DETECTED
              </span>
              <span className="text-xs text-slate-400">{new Date(current.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">{current.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/disruptions')}
            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-glow-amber bg-gradient-to-r from-amber-500 to-rose-500"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Inspect & Self-Heal
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
