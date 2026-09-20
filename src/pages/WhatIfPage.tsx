import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { WhatIfSimulator } from '../services/whatIfSimulator';
import { WhatIfScenario } from '../types';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Calendar,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';

export const WhatIfPage: React.FC = () => {
  const { activeTrip, updateTrip } = useTrip();

  const [scenarioType, setScenarioType] = useState<WhatIfScenario['scenario_type']>('BUDGET_CHANGE');
  const [targetBudget, setTargetBudget] = useState(20000);
  const [categoryToRemove, setCategoryToRemove] = useState('Shopping');
  const [simulatedResult, setSimulatedResult] = useState<WhatIfScenario['result_data'] | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleSimulate = () => {
    setAppliedSuccess(false);
    const res = WhatIfSimulator.simulate(activeTrip, scenarioType, {
      targetBudget,
      category: categoryToRemove,
    });
    setSimulatedResult(res);
  };

  const handleApplyScenario = () => {
    if (!simulatedResult) return;

    const updated = {
      ...activeTrip,
      budget: simulatedResult.simulated_budget,
      days: simulatedResult.simulated_days,
      updated_at: new Date().toISOString(),
    };

    updateTrip(updated);
    setAppliedSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4" />
          Sandboxed Hypothesis Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-1">
          What-If Scenario Simulator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Test hypothesis modifications without affecting your live trip until you commit changes.
        </p>
      </div>

      {/* Scenario Controls Card */}
      <div className="glass-card p-6 border-brand-500/30 space-y-6">
        <h3 className="text-base font-bold text-white">1. Select Hypothesis Scenario</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              type: 'BUDGET_CHANGE',
              title: 'Adjust Budget Ceiling',
              desc: 'Simulate scaling total budget down or up.',
            },
            {
              type: 'ADD_DAY',
              title: 'Add Extra Exploration Day',
              desc: 'Simulate extending the trip with extra sights.',
            },
            {
              type: 'REMOVE_ACTIVITY',
              title: 'Remove Category',
              desc: 'Prune low-interest categories across all days.',
            },
          ].map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                setScenarioType(item.type as any);
                setSimulatedResult(null);
                setAppliedSuccess(false);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                scenarioType === item.type
                  ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow/30'
                  : 'bg-navy-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Dynamic Parameter Input */}
        <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
          {scenarioType === 'BUDGET_CHANGE' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-300 uppercase">
                  Target Budget Simulation (₹)
                </label>
                <span className="text-sm font-extrabold text-cyan-400">
                  ₹{targetBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="50000"
                step="1000"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>₹10,000 (Lean Budget)</span>
                <span>Current: ₹{activeTrip.budget.toLocaleString()}</span>
                <span>₹50,000 (Luxury Pacing)</span>
              </div>
            </div>
          )}

          {scenarioType === 'ADD_DAY' && (
            <p className="text-xs text-slate-300">
              This scenario will synthesize Day 5 in South Goa (Palolem Beach & Wildlife Reserve) and calculate transit impacts.
            </p>
          )}

          {scenarioType === 'REMOVE_ACTIVITY' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Category to Remove
              </label>
              <select
                value={categoryToRemove}
                onChange={(e) => setCategoryToRemove(e.target.value)}
                className="glass-input w-full"
              >
                <option value="Shopping" className="bg-navy-900">Shopping</option>
                <option value="Nightlife" className="bg-navy-900">Nightlife</option>
                <option value="Adventure" className="bg-navy-900">Adventure</option>
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleSimulate}
          className="btn-primary text-xs py-3 px-6 flex items-center gap-2 shadow-glow"
        >
          <Sparkles className="w-4 h-4" />
          Generate Side-by-Side Simulation
        </button>
      </div>

      {/* Side-by-Side Comparison Area */}
      {simulatedResult && (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Current Live Plan */}
            <div className="glass-card p-6 space-y-4 border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Baseline</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                  CURRENT LIVE TRIP
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 flex justify-between">
                  <span className="text-xs text-slate-400">Total Budget</span>
                  <span className="text-sm font-bold text-white">
                    ₹{simulatedResult.original_budget.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 flex justify-between">
                  <span className="text-xs text-slate-400">Total Activities</span>
                  <span className="text-sm font-bold text-white">
                    {simulatedResult.original_activity_count} Scheduled Stops
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 flex justify-between">
                  <span className="text-xs text-slate-400">Trip Duration</span>
                  <span className="text-sm font-bold text-white">
                    {activeTrip.days?.length || 4} Days
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Simulated Plan */}
            <div className="glass-card p-6 space-y-4 border-brand-500/50 shadow-glow bg-brand-950/10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase">Hypothesis Result</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  SIMULATED SCENARIO
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-navy-950 border border-cyan-500/30 flex justify-between">
                  <span className="text-xs text-slate-400">Simulated Budget</span>
                  <span className="text-sm font-bold text-cyan-300">
                    ₹{simulatedResult.simulated_budget.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950 border border-cyan-500/30 flex justify-between">
                  <span className="text-xs text-slate-400">Simulated Activities</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {simulatedResult.simulated_activity_count} Scheduled Stops
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-950 border border-cyan-500/30 flex justify-between">
                  <span className="text-xs text-slate-400">Trip Duration</span>
                  <span className="text-sm font-bold text-cyan-300">
                    {simulatedResult.simulated_days.length} Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delta Changes Explanations */}
          <div className="glass-card p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Projected Changes Summary
            </h4>
            <div className="space-y-2">
              {simulatedResult.changes_summary.map((change, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>{change}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800 mt-4">
              <span className="text-xs text-slate-400">
                Ready to commit these adjustments to your live itinerary?
              </span>
              <button
                onClick={handleApplyScenario}
                disabled={appliedSuccess}
                className="btn-primary text-xs py-2.5 px-5 shadow-glow"
              >
                {appliedSuccess ? 'Scenario Applied Successfully!' : 'APPLY SCENARIO TO LIVE TRIP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
