import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, DollarSign, Calendar } from 'lucide-react';
import { PriorityBadge } from '../components/PriorityBadge';

// Custom Map Marker Icon Factory
const createCustomIcon = (category: string) => {
  let color = '#00b4d8';
  if (category === 'Accommodation') color = '#10b981';
  else if (category === 'Food') color = '#f59e0b';
  else if (category === 'History') color = '#8b5cf6';
  else if (category === 'Transit') color = '#64748b';

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
      <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
    </div>`,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const MapPage: React.FC = () => {
  const { activeTrip } = useTrip();
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  const days = activeTrip.days || [];
  const allActivities = days.flatMap((d) => d.activities);
  const filteredActivities =
    selectedDay === 'all'
      ? allActivities
      : (days.find((d) => d.day_number === selectedDay)?.activities || []);

  const defaultCenter: [number, number] = [15.5186, 73.7684]; // Goa center

  const routePolyline: [number, number][] = filteredActivities
    .filter((a) => a.latitude && a.longitude)
    .map((a) => [a.latitude, a.longitude]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Spatial Geography
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Interactive Route Map
          </h1>
        </div>

        {/* Day Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-navy-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDay === 'all' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Days
          </button>
          {days.map((d) => (
            <button
              key={d.day_number}
              onClick={() => setSelectedDay(d.day_number)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDay === d.day_number ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Day {d.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Map Card Container */}
      <div className="glass-card overflow-hidden h-[550px] relative border-slate-800 z-0">
        <MapContainer
          center={routePolyline[0] || defaultCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Polyline Route */}
          {routePolyline.length > 1 && (
            <Polyline
              positions={routePolyline}
              pathOptions={{ color: '#00b4d8', weight: 4, dashArray: '6, 8', opacity: 0.8 }}
            />
          )}

          {/* Activity Markers */}
          {filteredActivities.map((act) => (
            <Marker
              key={act.id}
              position={[act.latitude || 15.5, act.longitude || 73.8]}
              icon={createCustomIcon(act.category)}
            >
              <Popup className="custom-popup">
                <div className="p-1 space-y-1.5 text-navy-950">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 uppercase">
                    {act.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{act.name}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{act.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-200">
                    <span>{act.start_time} - {act.end_time}</span>
                    <span>₹{act.estimated_cost}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend & Waypoint Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Beaches & Sights', color: 'bg-cyan-500' },
          { label: 'Accommodation', color: 'bg-emerald-500' },
          { label: 'Food & Shacks', color: 'bg-amber-500' },
          { label: 'Heritage & Culture', color: 'bg-purple-500' },
        ].map((leg, i) => (
          <div key={i} className="glass-card p-3 flex items-center gap-2 text-xs text-slate-300">
            <span className={`w-3 h-3 rounded-full ${leg.color}`} />
            <span>{leg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
