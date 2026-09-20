import React, { useState } from 'react';
import { Activity, PriorityLevel, ActivityCategory } from '../types';
import { X, Clock, MapPin, DollarSign, Sparkles, Check } from 'lucide-react';
import { GOA_CANDIDATE_ALTERNATIVES } from '../lib/mockData';

interface ActivityDetailModalProps {
  activity: Activity;
  onClose: () => void;
  onSave: (updated: Activity) => void;
  onReplaceWithAlternative: (alt: any) => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
  onSave,
  onReplaceWithAlternative,
}) => {
  const [name, setName] = useState(activity.name);
  const [category, setCategory] = useState<ActivityCategory>(activity.category);
  const [startTime, setStartTime] = useState(activity.start_time);
  const [endTime, setEndTime] = useState(activity.end_time);
  const [cost, setCost] = useState(activity.estimated_cost);
  const [priority, setPriority] = useState<PriorityLevel>(activity.priority);
  const [tab, setTab] = useState<'details' | 'alternatives'>('details');

  const categories: ActivityCategory[] = [
    'Beaches',
    'Adventure',
    'Food',
    'History',
    'Culture',
    'Shopping',
    'Nature',
    'Nightlife',
    'Family',
    'Photography',
    'Transit',
    'Accommodation',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...activity,
      name,
      category,
      start_time: startTime,
      end_time: endTime,
      estimated_cost: Number(cost),
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-xl w-full p-6 relative my-8 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex rounded-lg bg-navy-950 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => setTab('details')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                tab === 'details' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Activity Details
            </button>
            <button
              type="button"
              onClick={() => setTab('alternatives')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1 transition-all ${
                tab === 'alternatives' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Find Alternatives
            </button>
          </div>
        </div>

        {tab === 'details' ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Activity Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                  className="glass-input w-full"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-navy-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="glass-input w-full"
                >
                  <option value="HIGH" className="bg-navy-900 text-white">HIGH</option>
                  <option value="MEDIUM" className="bg-navy-900 text-white">MEDIUM</option>
                  <option value="LOW" className="bg-navy-900 text-white">LOW</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Cost (₹)
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="glass-input w-full"
                  min="0"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select an alternative to replace <span className="text-white font-semibold">{activity.name}</span>.
            </p>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {GOA_CANDIDATE_ALTERNATIVES.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800 hover:border-brand-500/50 flex items-center justify-between gap-3 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{alt.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase">
                        {alt.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{alt.reason}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span>{alt.distance} km</span>
                      <span>₹{alt.cost}</span>
                      <span className="text-emerald-400 font-semibold">{alt.score}% match</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onReplaceWithAlternative(alt);
                      onClose();
                    }}
                    className="btn-primary text-xs py-1.5 px-3 shrink-0"
                  >
                    Swap In
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
