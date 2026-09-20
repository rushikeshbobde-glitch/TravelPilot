import { Trip, Disruption, TripChangeLog, RiskEvent, ChatMessage, WhatIfScenario } from '../types';
import { INITIAL_GOA_TRIP, INITIAL_RISKS, DEMO_USER } from './mockData';

const STORAGE_KEYS = {
  TRIPS: 'travelpilot_trips_v1',
  ACTIVE_TRIP_ID: 'travelpilot_active_trip_id_v1',
  DISRUPTIONS: 'travelpilot_disruptions_v1',
  CHANGELOGS: 'travelpilot_changelogs_v1',
  RISKS: 'travelpilot_risks_v1',
  CHATS: 'travelpilot_chats_v1',
  WHAT_IF: 'travelpilot_what_if_v1',
  DEMO_MODE: 'travelpilot_demo_mode_v1',
  AUTH_USER: 'travelpilot_auth_user_v1',
};

class StorageRepository {
  private isBrowser = typeof window !== 'undefined';

  constructor() {
    this.initDefaults();
  }

  public initDefaults(forceReset = false) {
    if (!this.isBrowser) return;

    if (forceReset || !localStorage.getItem(STORAGE_KEYS.TRIPS)) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify([INITIAL_GOA_TRIP]));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, INITIAL_GOA_TRIP.id);
      localStorage.setItem(STORAGE_KEYS.DISRUPTIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CHANGELOGS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(INITIAL_RISKS));
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.WHAT_IF, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEMO_USER));
    }
  }

  // Auth User
  public getAuthUser() {
    if (!this.isBrowser) return DEMO_USER;
    const item = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return item ? JSON.parse(item) : DEMO_USER;
  }

  public setAuthUser(user: any) {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  }

  // Demo Mode
  public isDemoMode(): boolean {
    if (!this.isBrowser) return true;
    const mode = localStorage.getItem(STORAGE_KEYS.DEMO_MODE);
    return mode === null ? true : mode === 'true';
  }

  public setDemoMode(enabled: boolean) {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(enabled));
  }

  // Trips
  public getTrips(): Trip[] {
    if (!this.isBrowser) return [INITIAL_GOA_TRIP];
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [INITIAL_GOA_TRIP];
  }

  public getTripById(id: string): Trip | null {
    const trips = this.getTrips();
    return trips.find((t) => t.id === id) || null;
  }

  public getActiveTrip(): Trip {
    const trips = this.getTrips();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID);
    const found = trips.find((t) => t.id === activeId);
    return found || trips[0] || INITIAL_GOA_TRIP;
  }

  public setActiveTripId(id: string) {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, id);
  }

  public saveTrip(trip: Trip): Trip {
    if (!this.isBrowser) return trip;
    const trips = this.getTrips();
    const index = trips.findIndex((t) => t.id === trip.id);
    if (index >= 0) {
      trips[index] = { ...trip, updated_at: new Date().toISOString() };
    } else {
      trips.unshift({ ...trip, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    return trip;
  }

  public deleteTrip(id: string) {
    if (!this.isBrowser) return;
    const trips = this.getTrips().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    if (localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID) === id && trips.length > 0) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, trips[0].id);
    }
  }

  // Disruptions
  public getDisruptions(tripId?: string): Disruption[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(STORAGE_KEYS.DISRUPTIONS);
    const list: Disruption[] = data ? JSON.parse(data) : [];
    return tripId ? list.filter((d) => d.trip_id === tripId) : list;
  }

  public saveDisruption(disruption: Disruption) {
    if (!this.isBrowser) return;
    const list = this.getDisruptions();
    const idx = list.findIndex((d) => d.id === disruption.id);
    if (idx >= 0) list[idx] = disruption;
    else list.unshift(disruption);
    localStorage.setItem(STORAGE_KEYS.DISRUPTIONS, JSON.stringify(list));
  }

  // Changelogs / Explainability
  public getChangeLogs(tripId?: string): TripChangeLog[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(STORAGE_KEYS.CHANGELOGS);
    const list: TripChangeLog[] = data ? JSON.parse(data) : [];
    return tripId ? list.filter((c) => c.trip_id === tripId) : list;
  }

  public addChangeLog(log: TripChangeLog) {
    if (!this.isBrowser) return;
    const list = this.getChangeLogs();
    list.unshift(log);
    localStorage.setItem(STORAGE_KEYS.CHANGELOGS, JSON.stringify(list));
  }

  // Risks
  public getRisks(tripId?: string): RiskEvent[] {
    if (!this.isBrowser) return INITIAL_RISKS;
    const data = localStorage.getItem(STORAGE_KEYS.RISKS);
    const list: RiskEvent[] = data ? JSON.parse(data) : INITIAL_RISKS;
    return tripId ? list.filter((r) => r.trip_id === tripId) : list;
  }

  public saveRisk(risk: RiskEvent) {
    if (!this.isBrowser) return;
    const list = this.getRisks();
    const idx = list.findIndex((r) => r.id === risk.id);
    if (idx >= 0) list[idx] = risk;
    else list.unshift(risk);
    localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(list));
  }

  // Chat Messages
  public getChatMessages(tripId?: string): ChatMessage[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    const list: ChatMessage[] = data ? JSON.parse(data) : [];
    return tripId ? list.filter((m) => m.trip_id === tripId) : list;
  }

  public addChatMessage(msg: ChatMessage) {
    if (!this.isBrowser) return;
    const list = this.getChatMessages();
    list.push(msg);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(list));
  }

  // What If
  public getWhatIfScenarios(tripId?: string): WhatIfScenario[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(STORAGE_KEYS.WHAT_IF);
    const list: WhatIfScenario[] = data ? JSON.parse(data) : [];
    return tripId ? list.filter((w) => w.trip_id === tripId) : list;
  }

  public saveWhatIfScenario(scenario: WhatIfScenario) {
    if (!this.isBrowser) return;
    const list = this.getWhatIfScenarios();
    const idx = list.findIndex((w) => w.id === scenario.id);
    if (idx >= 0) list[idx] = scenario;
    else list.unshift(scenario);
    localStorage.setItem(STORAGE_KEYS.WHAT_IF, JSON.stringify(list));
  }
}

export const storage = new StorageRepository();
