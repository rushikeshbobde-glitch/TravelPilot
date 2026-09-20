import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import {
  Settings,
  Key,
  Shield,
  RotateCcw,
  Sparkles,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isDemoMode, toggleDemoMode, resetToDemoAccount, user } = useAuth();
  const { resetDemoData, activeTrip, updateTrip } = useTrip();

  const [aiKey, setAiKey] = useState('');
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');
  const [currency, setCurrency] = useState(activeTrip.currency || 'INR');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateTrip({
      ...activeTrip,
      currency,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFullReset = () => {
    resetToDemoAccount();
    resetDemoData();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-4 h-4" />
          System Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-1">
          Settings & Integrations
        </h1>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Demo Mode Controller */}
      <div className="glass-card p-6 border-brand-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Deterministic Demo Mode</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Run 100% locally with high-fidelity mock data and offline self-healing engine.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => toggleDemoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>
      </div>

      {/* API Integrations */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Key className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">External AI & Cloud API Keys (Optional)</h3>
        </div>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                AI Provider Key
              </label>
              <input
                type="password"
                value={aiKey}
                onChange={(e) => setAiKey(e.target.value)}
                placeholder="AI_API_KEY (Gemini / OpenAI)"
                className="glass-input w-full"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Deterministic demo fallback is used when left blank.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                AI Model
              </label>
              <input
                type="text"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="glass-input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="glass-input w-full sm:w-64"
            >
              <option value="INR" className="bg-navy-900">₹ INR (Indian Rupee)</option>
              <option value="USD" className="bg-navy-900">$ USD (US Dollar)</option>
              <option value="EUR" className="bg-navy-900">€ EUR (Euro)</option>
              <option value="GBP" className="bg-navy-900">£ GBP (British Pound)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="btn-primary text-xs py-2.5 px-6 shadow-glow">
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="glass-card p-6 border-rose-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reset Demo Environment</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Restores the golden Goa 4-Day trip, mock bookings, and clears simulation logs.
              </p>
            </div>
          </div>

          <button onClick={handleFullReset} className="btn-danger text-xs py-2 px-4 whitespace-nowrap">
            Factory Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
};
