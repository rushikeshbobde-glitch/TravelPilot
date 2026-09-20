import React from 'react';
import { useTrip } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { Booking, BookingType, BookingStatus } from '../types';
import {
  Plane,
  Building,
  Car,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  DollarSign,
  Zap,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { activeTrip, simulateDisruption } = useTrip();
  const navigate = useNavigate();

  const bookings = activeTrip.bookings || [];

  const handleSimulateFlightDelay = () => {
    simulateDisruption('FLIGHT_DELAY');
    navigate('/disruptions');
  };

  const handleSimulateHotelCancel = () => {
    simulateDisruption('HOTEL_CANCELLATION');
    navigate('/disruptions');
  };

  const getBookingIcon = (type: BookingType) => {
    switch (type) {
      case 'Flight':
        return Plane;
      case 'Hotel':
        return Building;
      case 'Transport':
        return Car;
      default:
        return Ticket;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Disruption Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Connected Reservations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Bookings & Reservations Hub
          </h1>
        </div>

        {/* Demo Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateFlightDelay}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Simulate Flight Delay
          </button>
          <button
            onClick={handleSimulateHotelCancel}
            className="btn-danger text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Simulate Hotel Cancel
          </button>
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((b) => {
          const Icon = getBookingIcon(b.type);
          return (
            <div
              key={b.id}
              className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-navy-950 text-slate-300 uppercase border border-slate-800">
                      {b.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{b.provider}</h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    b.status === 'CONFIRMED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Confirmation Ref</span>
                  <span className="font-mono font-bold text-cyan-300">{b.confirmation_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Cost</span>
                  <span className="font-bold text-white">₹{b.cost.toLocaleString()}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800 flex items-center justify-between text-slate-400">
                  <span>Start: {new Date(b.start_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  <QrCode className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
