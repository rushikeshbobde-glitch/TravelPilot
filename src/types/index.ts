// Core Domain Types for TravelPilot

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type TravelStyle = 'Relaxed' | 'Balanced' | 'Packed';
export type TransportPreference = 'Public Transport' | 'Taxi/Cab' | 'Rental Car' | 'Walking' | 'Mixed';

export type ActivityCategory =
  | 'Beaches'
  | 'Adventure'
  | 'Food'
  | 'History'
  | 'Culture'
  | 'Shopping'
  | 'Nature'
  | 'Nightlife'
  | 'Family'
  | 'Photography'
  | 'Transit'
  | 'Accommodation';

export type ActivityStatus =
  | 'scheduled'
  | 'directly_affected'
  | 'potentially_affected'
  | 'unaffected'
  | 'completed'
  | 'cancelled'
  | 'replaced';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface TripPreference {
  id: string;
  trip_id: string;
  interest: string;
  priority: PriorityLevel;
  created_at?: string;
}

export interface Activity {
  id: string;
  trip_id: string;
  itinerary_day_id?: string;
  name: string;
  category: ActivityCategory;
  description?: string;
  latitude: number;
  longitude: number;
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  duration_minutes: number;
  estimated_cost: number;
  priority: PriorityLevel;
  status: ActivityStatus;
  opening_time?: string;
  closing_time?: string;
  created_at?: string;
  updated_at?: string;
  backup_activities?: AlternativeOption[];
}

export interface ActivityDependency {
  id: string;
  activity_id: string;
  depends_on_activity_id: string;
  dependency_type: 'REQUIRES_COMPLETION' | 'TRANSIT_CONNECTION' | 'CHECK_IN_BEFORE';
}

export interface ItineraryDay {
  id: string;
  trip_id: string;
  date: string; // YYYY-MM-DD
  day_number: number;
  theme?: string;
  activities: Activity[];
}

export type BookingType = 'Flight' | 'Hotel' | 'Transport' | 'Activity';
export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'DELAYED';

export interface Booking {
  id: string;
  trip_id: string;
  type: BookingType;
  provider: string;
  confirmation_number: string;
  status: BookingStatus;
  start_time: string;
  end_time?: string;
  cost: number;
  created_at?: string;
}

export interface Accommodation {
  id: string;
  trip_id: string;
  name: string;
  address: string;
  check_in: string;
  check_out: string;
  cost: number;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface Transportation {
  id: string;
  trip_id: string;
  type: 'Flight' | 'Train' | 'Bus' | 'Cab' | 'Rental' | 'Walking';
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  cost: number;
  status: 'SCHEDULED' | 'DELAYED' | 'CANCELLED';
}

export interface Expense {
  id: string;
  trip_id: string;
  category: 'Accommodation' | 'Transportation' | 'Activities' | 'Food' | 'Local Travel' | 'Other';
  description: string;
  amount: number;
  date: string;
  created_at?: string;
}

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  travel_style: TravelStyle;
  transport_preference?: TransportPreference;
  status: 'active' | 'completed' | 'archived';
  preferences?: TripPreference[];
  days?: ItineraryDay[];
  bookings?: Booking[];
  expenses?: Expense[];
  created_at?: string;
  updated_at?: string;
}

export type DisruptionType =
  | 'VENUE_CLOSURE'
  | 'FLIGHT_DELAY'
  | 'HOTEL_CANCELLATION'
  | 'WEATHER_RISK'
  | 'TRANSIT_STRIKE'
  | 'SCHEDULE_CONFLICT';

export type DisruptionSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Disruption {
  id: string;
  trip_id: string;
  type: DisruptionType;
  title: string;
  description: string;
  severity: DisruptionSeverity;
  affected_entity_id: string;
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
  detected_at: string;
  resolved_at?: string;
}

export interface AlternativeOption {
  id: string;
  disruption_id?: string;
  activity_id?: string;
  name: string;
  category: ActivityCategory;
  score: number; // 0 - 100
  cost: number;
  distance: number; // in km
  duration_minutes: number;
  latitude: number;
  longitude: number;
  opening_time?: string;
  closing_time?: string;
  reason: string;
  status?: 'SUGGESTED' | 'ACCEPTED' | 'REJECTED';
}

export interface ImpactRadiusResult {
  directly_affected: Activity[];
  potentially_affected: Activity[];
  unaffected: Activity[];
  direct_count: number;
  potential_count: number;
  unaffected_count: number;
  severity: DisruptionSeverity;
  root_cause: string;
}

export interface RiskEvent {
  id: string;
  trip_id: string;
  type: 'WEATHER' | 'TRANSPORT' | 'ACTIVITY' | 'BOOKING' | 'SCHEDULE' | 'BUDGET';
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  probability: number; // 0.0 - 1.0
  impact: string;
  description: string;
  recommendation: string;
  status: 'MONITORING' | 'MITIGATED' | 'TRIGGERED';
  created_at?: string;
}

export interface TripChangeLog {
  id: string;
  trip_id: string;
  disruption_id?: string;
  change_type: 'ACTIVITY_REPLACED' | 'SCHEDULE_SHIFTED' | 'BUDGET_ADJUSTED' | 'TRIP_OPTIMIZED';
  before_data: any;
  after_data: any;
  reason: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_name?: string;
  tool_call_id?: string;
  tool_result?: any;
  created_at: string;
}

export interface WhatIfScenario {
  id: string;
  trip_id: string;
  user_id: string;
  scenario_type: 'BUDGET_CHANGE' | 'ADD_DAY' | 'REMOVE_DAY' | 'REMOVE_ACTIVITY' | 'ADD_ACTIVITY' | 'CHANGE_INTEREST';
  input_data: any;
  result_data: {
    original_budget: number;
    simulated_budget: number;
    original_activity_count: number;
    simulated_activity_count: number;
    changes_summary: string[];
    simulated_days: ItineraryDay[];
  };
  status: 'DRAFT' | 'APPLIED' | 'DISCARDED';
  created_at: string;
}

export interface BudgetSummary {
  total_budget: number;
  total_spent: number;
  remaining_budget: number;
  utilization_percentage: number;
  is_over_budget: boolean;
  currency: string;
  breakdown_by_category: {
    Accommodation: number;
    Transportation: number;
    Activities: number;
    Food: number;
    'Local Travel': number;
    Other: number;
  };
  daily_spend: {
    day_number: number;
    date: string;
    amount: number;
  }[];
}
