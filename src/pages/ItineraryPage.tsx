import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { Activity, PriorityLevel } from '../types';
import { PriorityBadge } from '../components/PriorityBadge';
import { ActivityDetailModal } from '../components/ActivityDetailModal';
import { RouteOptimizer } from '../services/routeOptimizer';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const ItineraryPage: React.FC = () => {
  const { activeTrip, updateTrip } = useTrip();
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const days = activeTrip.days || [];
  const currentDay = days[activeDayIndex] || days[0];
  const activities = currentDay?.activities || [];

  // Check conflicts in current day
  const conflicts: string[] = [];
  for (let i = 0; i < activities.length - 1; i++) {
    if (RouteOptimizer.hasTimeConflict(activities[i], activities[i + 1])) {
      conflicts.push(`Overlap between "${activities[i].name}" and "${activities[i + 1].name}"`);
    }
  }

  const handleSaveActivity = (updatedAct: Activity) => {
    const updatedDays = days.map((day, dIdx) => {
      if (dIdx !== activeDayIndex) return day;
      return {
        ...day,
        activities: day.activities.map((a) => (a.id === updatedAct.id ? updatedAct : a)),
      };
    });
    updateTrip({ ...activeTrip, days: updatedDays });
  };

  const handleRemoveActivity = (actId: string) => {
    const updatedDays = days.map((day, dIdx) => {
      if (dIdx !== activeDayIndex) return day;
      return {
        ...day,
        activities: day.activities.filter((a) => a.id !== actId),
      };
    });
    updateTrip({ ...activeTrip, days: updatedDays });
  };

  const handleMoveActivity = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= activities.length) return;

    const newActivities = [...activities];
    const temp = newActivities[idx];
    newActivities[idx] = newActivities[newIdx];
    newActivities[newIdx] = temp;

    const updatedDays = days.map((day, dIdx) => {
      if (dIdx !== activeDayIndex) return day;
      return { ...day, activities: newActivities };
    });
    updateTrip({ ...activeTrip, days: updatedDays });
  };

  const handleAddCustomActivity = () => {
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      trip_id: activeTrip.id,
      itinerary_day_id: currentDay.id,
      name: 'New Custom Sightseeing Stop',
      category: 'Culture',
      description: 'Explore local sights at your own pace',
      latitude: 15.5,
      longitude: 73.8,
      start_time: '16:00',
      end_time: '17:30',
      duration_minutes: 90,
      estimated_cost: 300,
      priority: 'MEDIUM',
      status: 'scheduled',
      opening_time: '09:00',
      closing_time: '20:00',
    };

    const updatedDays = days.map((day, dIdx) => {
      if (dIdx !== activeDayIndex) return day;
      return { ...day, activities: [...day.activities, newAct] };
    });
    updateTrip({ ...activeTrip, days: updatedDays });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Connected Timeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Trip Itinerary
          </h1>
        </div>

        <button
          onClick={handleAddCustomActivity}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {days.map((d, index) => (
          <button
            key={d.id || index}
            onClick={() => setActiveDayIndex(index)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDayIndex === index
                ? 'bg-brand-500 text-white shadow-glow'
                : 'bg-navy-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day {d.day_number}</span>
            <span className="text-[10px] opacity-75">({d.date.slice(5)})</span>
          </button>
        ))}
      </div>

      {/* Day Theme Banner */}
      <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-brand-500/20">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Day {currentDay?.day_number} Theme
          </span>
          <h2 className="text-lg font-bold text-white mt-0.5">{currentDay?.theme || 'Exploration Trail'}</h2>
        </div>
        <div className="text-xs text-slate-400">
          {activities.length} Activities • ₹{activities.reduce((s, a) => s + a.estimated_cost, 0)} Total
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 space-y-1 text-xs text-amber-300">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Schedule Conflict Warning</span>
          </div>
          {conflicts.map((c, i) => (
            <p key={i} className="pl-6">{c}</p>
          ))}
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-7 before:w-0.5 before:bg-slate-800/80 before:hidden sm:before:block">
        {activities.map((act, index) => (
          <div
            key={act.id}
            className={`glass-card p-5 relative transition-all ${
              act.status === 'replaced'
                ? 'border-emerald-500/40 bg-emerald-950/20 shadow-glow-emerald/20'
                : 'hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="flex items-start gap-4">
                <div className="w-16 py-2 rounded-xl bg-navy-950 border border-slate-800 text-center shrink-0">
                  <span className="text-xs font-extrabold text-white">{act.start_time}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{act.end_time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white">{act.name}</h3>
                    <PriorityBadge priority={act.priority} />
                    {act.status === 'replaced' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AUTO-HEALED REPLACEMENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 max-w-xl">{act.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {act.duration_minutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      ₹{act.estimated_cost}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-navy-950 text-[11px] font-medium text-slate-300 border border-slate-800">
                      {act.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Controls */}
              <div className="flex items-center gap-1.5 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                <button
                  onClick={() => handleMoveActivity(index, 'up')}
                  disabled={index === 0}
                  title="Move Up"
                  className="p-2 rounded-lg bg-navy-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingActivity(act)}
                  title="Edit or Find Alternatives"
                  className="p-2 rounded-lg bg-navy-950 border border-slate-800 text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-xs font-semibold px-2.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit / Swap</span>
                </button>
                <button
                  onClick={() => handleRemoveActivity(act.id)}
                  title="Remove Activity"
                  className="p-2 rounded-lg bg-navy-950 border border-slate-800 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Alternatives Modal */}
      {editingActivity && (
        <ActivityDetailModal
          activity={editingActivity}
          onClose={() => setEditingActivity(null)}
          onSave={handleSaveActivity}
          onReplaceWithAlternative={(alt) => {
            handleSaveActivity({
              ...editingActivity,
              name: alt.name,
              category: alt.category,
              description: alt.reason,
              estimated_cost: alt.cost,
              status: 'replaced',
            });
          }}
        />
      )}
    </div>
  );
};
