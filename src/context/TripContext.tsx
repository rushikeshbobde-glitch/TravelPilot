import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, Disruption, TripChangeLog, RiskEvent, AlternativeOption, ImpactRadiusResult } from '../types';
import { storage } from '../lib/storage';
import { SelfHealingEngine, SelfHealingResult } from '../services/selfHealingEngine';
import { ImpactRadiusEngine } from '../services/impactRadiusEngine';
import { GOA_CANDIDATE_ALTERNATIVES } from '../lib/mockData';

interface TripContextType {
  trips: Trip[];
  activeTrip: Trip;
  activeDisruptions: Disruption[];
  changeLogs: TripChangeLog[];
  risks: RiskEvent[];
  lastHealingResult: SelfHealingResult | null;
  setActiveTripId: (id: string) => void;
  createTrip: (trip: Trip) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  simulateDisruption: (type: Disruption['type'], customTitle?: string) => SelfHealingResult;
  applySelfHealing: (disruptionId: string, chosenAlternative?: AlternativeOption) => SelfHealingResult;
  refreshState: () => void;
  resetDemoData: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(storage.getTrips());
  const [activeTrip, setActiveTrip] = useState<Trip>(storage.getActiveTrip());
  const [activeDisruptions, setActiveDisruptions] = useState<Disruption[]>(
    storage.getDisruptions().filter((d) => d.status === 'ACTIVE')
  );
  const [changeLogs, setChangeLogs] = useState<TripChangeLog[]>(storage.getChangeLogs());
  const [risks, setRisks] = useState<RiskEvent[]>(storage.getRisks());
  const [lastHealingResult, setLastHealingResult] = useState<SelfHealingResult | null>(null);

  const refreshState = () => {
    const allTrips = storage.getTrips();
    setTrips(allTrips);
    const curr = storage.getActiveTrip();
    setActiveTrip(curr);
    setActiveDisruptions(storage.getDisruptions(curr?.id).filter((d) => d.status === 'ACTIVE'));
    setChangeLogs(storage.getChangeLogs(curr?.id));
    setRisks(storage.getRisks(curr?.id));
  };

  const handleSetActiveTripId = (id: string) => {
    storage.setActiveTripId(id);
    refreshState();
  };

  const handleCreateTrip = (newTrip: Trip) => {
    storage.saveTrip(newTrip);
    storage.setActiveTripId(newTrip.id);
    refreshState();
  };

  const handleUpdateTrip = (updated: Trip) => {
    storage.saveTrip(updated);
    refreshState();
  };

  const handleDeleteTrip = (id: string) => {
    storage.deleteTrip(id);
    refreshState();
  };

  const simulateDisruption = (type: Disruption['type'], customTitle?: string): SelfHealingResult => {
    const currTrip = storage.getActiveTrip();
    let affectedEntityId = '';
    let title = customTitle || 'Schedule Disruption';
    let desc = 'Unexpected venue operational constraint.';
    let severity: Disruption['severity'] = 'MEDIUM';

    // Locate realistic target activity in current trip
    const allActs = (currTrip.days || []).flatMap((d) => d.activities);

    if (type === 'VENUE_CLOSURE') {
      const museum = allActs.find((a) => a.name.includes('Museum') || a.category === 'History') || allActs[0];
      affectedEntityId = museum?.id || 'act-target';
      title = `Venue Closure: ${museum?.name || 'Archaeological Museum of Goa'}`;
      desc = `Archaeological Survey announced sudden preservation maintenance closure for ${museum?.name || 'the venue'}.`;
      severity = 'MEDIUM';
    } else if (type === 'FLIGHT_DELAY') {
      const flight = allActs.find((a) => a.category === 'Transit') || allActs[0];
      affectedEntityId = flight?.id || 'flight-target';
      title = 'Flight Inbound Delay (+2.5 Hours)';
      desc = 'Connecting flight delayed due to airspace congestion, pushing morning transfers.';
      severity = 'HIGH';
    } else if (type === 'HOTEL_CANCELLATION') {
      const hotel = allActs.find((a) => a.category === 'Accommodation') || allActs[0];
      affectedEntityId = hotel?.id || 'hotel-target';
      title = 'Hotel System Overbooking Cancellation';
      desc = 'Overbooking alert received from resort reception.';
      severity = 'CRITICAL';
    } else if (type === 'WEATHER_RISK') {
      const beach = allActs.find((a) => a.category === 'Adventure' || a.category === 'Beaches') || allActs[0];
      affectedEntityId = beach?.id || 'beach-target';
      title = 'Coastal Thunderstorm & Wave Warning';
      desc = 'High tide advisory and heavy squall warning on the coastal zone.';
      severity = 'HIGH';
    }

    const disruption: Disruption = {
      id: `disrupt-${Date.now()}`,
      trip_id: currTrip.id,
      type,
      title,
      description: desc,
      severity,
      affected_entity_id: affectedEntityId,
      status: 'ACTIVE',
      detected_at: new Date().toISOString(),
    };

    // Execute Self Healing
    const result = SelfHealingEngine.executeSelfHealing(currTrip, disruption, GOA_CANDIDATE_ALTERNATIVES);
    setLastHealingResult(result);
    refreshState();
    return result;
  };

  const applySelfHealing = (disruptionId: string, chosenAlternative?: AlternativeOption): SelfHealingResult => {
    const currTrip = storage.getActiveTrip();
    const disruption = storage.getDisruptions(currTrip.id).find((d) => d.id === disruptionId);
    if (!disruption) throw new Error('Disruption not found');

    const result = SelfHealingEngine.executeSelfHealing(
      currTrip,
      disruption,
      chosenAlternative ? [chosenAlternative, ...GOA_CANDIDATE_ALTERNATIVES] : GOA_CANDIDATE_ALTERNATIVES
    );
    setLastHealingResult(result);
    refreshState();
    return result;
  };

  const resetDemoData = () => {
    storage.initDefaults(true);
    refreshState();
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeDisruptions,
        changeLogs,
        risks,
        lastHealingResult,
        setActiveTripId: handleSetActiveTripId,
        createTrip: handleCreateTrip,
        updateTrip: handleUpdateTrip,
        deleteTrip: handleDeleteTrip,
        simulateDisruption,
        applySelfHealing,
        refreshState,
        resetDemoData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within a TripProvider');
  return context;
};
