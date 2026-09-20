import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  DollarSign,
  Heart,
  Sliders,
  Car,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { AIProviderService } from '../services/aiProvider';
import { PriorityLevel, TravelStyle, TransportPreference } from '../types';

export const PlanTripPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const { createTrip } = useTrip();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('My Next Adventure');
  const [destination, setDestination] = useState('Goa, India');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-13');
  const [budget, setBudget] = useState(25000);
  const [currency, setCurrency] = useState('INR');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Beaches', 'Food', 'History']);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Balanced');
  const [transportPreference, setTransportPreference] = useState<TransportPreference>('Mixed');
  const [priorities, setPriorities] = useState<Record<string, PriorityLevel>>({
    Beaches: 'HIGH',
    Food: 'HIGH',
    History: 'HIGH',
  });

  const availableInterests = [
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
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
      const nextPriorities = { ...priorities };
      delete nextPriorities[item];
      setPriorities(nextPriorities);
    } else {
      setSelectedInterests([...selectedInterests, item]);
      setPriorities({ ...priorities, [item]: 'MEDIUM' });
    }
  };

  const handlePriorityChange = (interest: string, priority: PriorityLevel) => {
    setPriorities({ ...priorities, [interest]: priority });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await AIProviderService.generateItinerary({
        name,
        destination,
        startDate,
        endDate,
        budget: Number(budget),
        currency,
        travelStyle,
        transportPreference,
        interests: selectedInterests,
        priorities,
      });

      const newTripId = `trip-${Date.now()}`;
      const createdTrip = {
        id: newTripId,
        user_id: '00000000-0000-0000-0000-000000000001',
        name: name || `${destination} Journey`,
        destination,
        start_date: startDate,
        end_date: endDate,
        budget: Number(budget),
        currency,
        travel_style: travelStyle,
        transport_preference: transportPreference,
        status: 'active' as const,
        preferences: selectedInterests.map((interest, i) => ({
          id: `pref-${i}`,
          trip_id: newTripId,
          interest,
          priority: priorities[interest] || 'MEDIUM',
        })),
        days: generated.itinerary.map((d) => ({
          ...d,
          trip_id: newTripId,
          activities: d.activities.map((a) => ({
            ...a,
            trip_id: newTripId,
          })),
        })),
      };

      createTrip(createdTrip);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to generate trip:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress Wizard Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Step {step} of 8</span>
          <span className="text-cyan-400 font-bold">
            {step === 1 && 'Destination'}
            {step === 2 && 'Dates'}
            {step === 3 && 'Budget'}
            {step === 4 && 'Interests'}
            {step === 5 && 'Travel Style'}
            {step === 6 && 'Transport'}
            {step === 7 && 'Priority Weighting'}
            {step === 8 && 'Generate Itinerary'}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-accent-cyan h-full transition-all duration-300 shadow-glow"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Content Card */}
      <div className="glass-card p-6 sm:p-10 border-brand-500/30 shadow-glow relative min-h-[420px] flex flex-col justify-between">
        {/* STEP 1: Destination */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 1</span>
              <h2 className="text-2xl font-black text-white mt-1">Where are you traveling?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your destination city, region, or country.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full"
                  placeholder="e.g. Goa Escape & Heritage Discovery"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="glass-input w-full"
                  placeholder="e.g. Goa, India"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Goa, India', 'Paris, France', 'Tokyo, Japan', 'Bali, Indonesia'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setDestination(preset);
                      setName(`${preset.split(',')[0]} Discovery`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-xs text-slate-300 hover:border-cyan-400 hover:text-white"
                  >
                    📍 {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Dates */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 2</span>
              <h2 className="text-2xl font-black text-white mt-1">When are you traveling?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your trip start and return dates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Budget */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 3</span>
              <h2 className="text-2xl font-black text-white mt-1">What is your total budget?</h2>
              <p className="text-xs text-slate-400 mt-1">
                TravelPilot will optimize flights, hotels, and activities to fit this limit.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="INR" className="bg-navy-900">₹ INR</option>
                  <option value="USD" className="bg-navy-900">$ USD</option>
                  <option value="EUR" className="bg-navy-900">€ EUR</option>
                  <option value="GBP" className="bg-navy-900">£ GBP</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="glass-input w-full"
                  min="1000"
                  step="500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {[15000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBudget(amt)}
                  className={`px-3 py-1.5 rounded-lg border text-xs ${
                    budget === amt
                      ? 'bg-brand-500/20 border-brand-400 text-white font-bold'
                      : 'bg-navy-950 border-slate-700 text-slate-300'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Interests */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 4</span>
              <h2 className="text-2xl font-black text-white mt-1">Select your travel interests</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose the themes that define your journey.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow/30'
                        : 'bg-navy-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{interest}</span>
                    {isSelected && <Check className="w-4 h-4 text-brand-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Travel Style */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 5</span>
              <h2 className="text-2xl font-black text-white mt-1">What is your travel style?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Controls daily pacing, rest breaks, and activity volume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'Relaxed',
                  title: 'Relaxed',
                  desc: '2-3 activities per day, generous pauses, beach chills and late mornings.',
                },
                {
                  id: 'Balanced',
                  title: 'Balanced',
                  desc: '3-4 activities per day with structured transit and optimal sightseeing balance.',
                },
                {
                  id: 'Packed',
                  title: 'Packed',
                  desc: 'Full-day marathon covering maximum landmarks and vibrant nightlife.',
                },
              ].map((s) => (
                <div
                  key={s.id}
                  onClick={() => setTravelStyle(s.id as TravelStyle)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    travelStyle === s.id
                      ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow/30'
                      : 'bg-navy-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Transport Preference */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 6</span>
              <h2 className="text-2xl font-black text-white mt-1">Transportation Preference</h2>
              <p className="text-xs text-slate-400 mt-1">
                How would you prefer navigating {destination}?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Public Transport',
                'Taxi/Cab',
                'Rental Car',
                'Walking',
                'Mixed',
              ].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTransportPreference(mode as TransportPreference)}
                  className={`p-4 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                    transportPreference === mode
                      ? 'bg-brand-500/20 border-brand-400 text-white shadow-glow/30'
                      : 'bg-navy-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{mode}</span>
                  {transportPreference === mode && <Check className="w-4 h-4 text-brand-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Priority Selection */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 7</span>
              <h2 className="text-2xl font-black text-white mt-1">Assign Interest Priorities</h2>
              <p className="text-xs text-slate-400 mt-1">
                The self-healing optimizer will aggressively protect your HIGH-priority activities during disruptions.
              </p>
            </div>

            <div className="space-y-3">
              {selectedInterests.map((interest) => (
                <div
                  key={interest}
                  className="p-4 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-sm font-bold text-white">{interest}</span>
                  <div className="flex gap-1.5">
                    {(['HIGH', 'MEDIUM', 'LOW'] as PriorityLevel[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePriorityChange(interest, p)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          (priorities[interest] || 'MEDIUM') === p
                            ? p === 'HIGH'
                              ? 'bg-rose-500 text-white shadow-glow-rose'
                              : p === 'MEDIUM'
                              ? 'bg-amber-500 text-navy-950 font-extrabold'
                              : 'bg-slate-700 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Summary & Generate */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">STEP 8</span>
              <h2 className="text-2xl font-black text-white mt-1">Ready to Generate Your Digital Twin</h2>
              <p className="text-xs text-slate-400 mt-1">
                Review your parameters before launching AI itinerary synthesis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-white">{destination}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Dates</span>
                <span className="font-bold text-white">{startDate} to {endDate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Budget Limit</span>
                <span className="font-bold text-emerald-400">₹{Number(budget).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Style & Transit</span>
                <span className="font-bold text-white">{travelStyle} / {transportPreference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priorities</span>
                <span className="font-bold text-cyan-400">
                  {Object.entries(priorities)
                    .map(([k, v]) => `${k} (${v})`)
                    .join(', ')}
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full btn-primary text-sm py-4 flex items-center justify-center gap-2 shadow-glow"
            >
              <Sparkles className="w-5 h-5" />
              {isGenerating ? 'Synthesizing Digital Twin & Optimizing Routes...' : 'GENERATE SELF-HEALING TRIP'}
            </button>
          </div>
        )}

        {/* Wizard Controls Navigation */}
        <div className="pt-8 flex items-center justify-between border-t border-slate-800 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 8 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-primary text-xs flex items-center gap-1.5 shadow-glow"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
