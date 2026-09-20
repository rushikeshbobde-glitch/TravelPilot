import React from 'react';
import { Sparkles, CheckCircle2, DollarSign, Clock, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { SelfHealingResult } from '../services/selfHealingEngine';

interface ExplainableChangeModalProps {
  result: SelfHealingResult;
  onClose: () => void;
}

export const ExplainableChangeModal: React.FC<ExplainableChangeModalProps> = ({ result, onClose }) => {
  const { explanation, selectedAlternative, allCandidates } = result;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-2xl w-full border-brand-500/50 shadow-glow p-6 sm:p-8 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Explainable AI</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{explanation.title}</h2>
          </div>
        </div>

        {/* What & Why Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase">What Changed</p>
            <p className="text-sm font-bold text-white mt-1">{explanation.whatChanged}</p>
          </div>
          <div className="p-4 rounded-xl bg-navy-950/60 border border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase">Reason / Why</p>
            <p className="text-sm font-medium text-slate-300 mt-1">{explanation.why}</p>
          </div>
        </div>

        {/* Impact Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">Budget Impact</p>
              <p className="text-sm font-bold text-emerald-300">{explanation.costChange}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">Schedule Impact</p>
              <p className="text-sm font-bold text-cyan-300">{explanation.timeChange}</p>
            </div>
          </div>
        </div>

        {/* Selection Rationale */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Deterministic Decision Rationale
          </h4>
          <div className="space-y-2">
            {explanation.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Alternatives Evaluated */}
        {allCandidates && allCandidates.length > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Alternative Candidates Evaluated ({allCandidates.length})
            </h4>
            <div className="space-y-2">
              {allCandidates.slice(0, 3).map((cand) => (
                <div
                  key={cand.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs ${
                    cand.id === selectedAlternative.id
                      ? 'bg-brand-500/20 border border-brand-400/40 text-white font-semibold'
                      : 'bg-navy-950/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cand.id === selectedAlternative.id && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-500 text-[10px] font-bold text-white">
                        SELECTED
                      </span>
                    )}
                    <span>{cand.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{cand.distance} km</span>
                    <span>₹{cand.cost}</span>
                    <span className="font-bold text-brand-400">{cand.score}% fit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="btn-primary w-full sm:w-auto">
            Got It, Looks Great!
          </button>
        </div>
      </div>
    </div>
  );
};
