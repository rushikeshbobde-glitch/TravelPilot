import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { Disruption, AlternativeOption } from '../types';
import { ImpactRadiusGraph } from '../components/ImpactRadiusGraph';
import { ExplainableChangeModal } from '../components/ExplainableChangeModal';
import { ImpactRadiusEngine } from '../services/impactRadiusEngine';
import { GOA_CANDIDATE_ALTERNATIVES } from '../lib/mockData';
import {
  AlertTriangle,
  Zap,
  Sparkles,
  Plane,
  Building,
  CloudRain,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const DisruptionsPage: React.FC = () => {
  const {
    activeTrip,
    activeDisruptions,
    changeLogs,
    simulateDisruption,
    applySelfHealing,
    lastHealingResult,
  } = useTrip();

  const [selectedDisruption, setSelectedDisruption] = useState<Disruption | null>(
    activeDisruptions[0] || null
  );
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Default active or simulated impact preview
  const currentDisruption =
    selectedDisruption ||
    activeDisruptions[0] || {
      id: 'demo-disp',
      trip_id: activeTrip.id,
      type: 'VENUE_CLOSURE',
      title: 'Simulated Museum Closure',
      description: 'Archaeological Museum of Goa closed for preservation work.',
      severity: 'MEDIUM',
      affected_entity_id: '33333333-3333-3333-3333-333333330201',
      status: 'ACTIVE',
      detected_at: new Date().toISOString(),
    };

  const impactRadius = ImpactRadiusEngine.calculateImpact(activeTrip, currentDisruption);

  const handleTriggerSimulation = (type: Disruption['type']) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = simulateDisruption(type);
      setSelectedDisruption(null);
      setIsProcessing(false);
      setShowModal(true);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Active Self-Healing Pipeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-1">
            Disruption Center & Impact Analysis
          </h1>
        </div>

        {/* Demo Simulation Trigger Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTriggerSimulation('VENUE_CLOSURE')}
            disabled={isProcessing}
            className="btn-primary text-xs py-2.5 px-3.5 flex items-center gap-1.5 shadow-glow-rose bg-gradient-to-r from-rose-500 to-amber-500"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Museum Closure
          </button>
          <button
            onClick={() => handleTriggerSimulation('FLIGHT_DELAY')}
            disabled={isProcessing}
            className="btn-secondary text-xs py-2.5 px-3.5 flex items-center gap-1.5 border-amber-500/30 text-amber-300"
          >
            <Plane className="w-3.5 h-3.5 text-amber-400" />
            Simulate Flight Delay
          </button>
          <button
            onClick={() => handleTriggerSimulation('HOTEL_CANCELLATION')}
            disabled={isProcessing}
            className="btn-secondary text-xs py-2.5 px-3.5 flex items-center gap-1.5 border-rose-500/30 text-rose-300"
          >
            <Building className="w-3.5 h-3.5 text-rose-400" />
            Simulate Hotel Cancel
          </button>
          <button
            onClick={() => handleTriggerSimulation('WEATHER_RISK')}
            disabled={isProcessing}
            className="btn-secondary text-xs py-2.5 px-3.5 flex items-center gap-1.5 border-cyan-500/30 text-cyan-300"
          >
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            Simulate Weather Squall
          </button>
        </div>
      </div>

      {/* Impact Radius Graph Visualization */}
      <ImpactRadiusGraph impact={impactRadius} />

      {/* Candidate Alternatives & Healing Rationale Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Alternatives Library */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Autonomous Sourcing
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Top Candidate Alternatives</h3>
            </div>
            <span className="text-xs text-slate-400">{GOA_CANDIDATE_ALTERNATIVES.length} Validated</span>
          </div>

          <div className="space-y-3">
            {GOA_CANDIDATE_ALTERNATIVES.map((alt, idx) => (
              <div
                key={alt.id}
                className={`p-4 rounded-xl border transition-all ${
                  idx === 0
                    ? 'bg-brand-500/15 border-brand-400/50 shadow-glow/20'
                    : 'bg-navy-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{alt.name}</h4>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded bg-brand-500 text-[10px] font-bold text-white uppercase">
                          OPTIMAL FIT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{alt.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-cyan-300">{alt.score}%</span>
                    <span className="block text-[10px] text-slate-400">Match Score</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <span>📍 {alt.distance} km</span>
                    <span>₹{alt.cost}</span>
                    <span className="text-slate-500">({alt.duration_minutes} mins)</span>
                  </div>

                  <button
                    onClick={() => {
                      applySelfHealing(currentDisruption.id, alt);
                      setShowModal(true);
                    }}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    Select Alternative
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self-Healed Changelogs & Explainability Log */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Explainable Audit Trail
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">Historical Self-Heals</h3>
            </div>
            <span className="text-xs text-slate-400">{changeLogs.length} Events</span>
          </div>

          {changeLogs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">All Itinerary Nodes Healthy</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No active failures recorded. Click "Simulate Museum Closure" above to test the autonomous self-healing pipeline.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {changeLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-navy-950/60 border border-emerald-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 uppercase">
                      {log.change_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200">{log.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Explainable AI */}
      {showModal && lastHealingResult && (
        <ExplainableChangeModal
          result={lastHealingResult}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
