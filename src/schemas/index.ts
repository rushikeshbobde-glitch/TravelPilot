import { z } from 'zod';

// Trip Creation Schema (8-step form validation)
export const tripCreationSchema = z.object({
  name: z.string().min(2, 'Trip name is required'),
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.number().min(1000, 'Budget must be at least ₹1,000'),
  currency: z.string().default('INR'),
  travelStyle: z.enum(['Relaxed', 'Balanced', 'Packed']).default('Balanced'),
  transportPreference: z.enum(['Public Transport', 'Taxi/Cab', 'Rental Car', 'Walking', 'Mixed']).default('Mixed'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  priorities: z.record(z.enum(['HIGH', 'MEDIUM', 'LOW'])).default({}),
});

export type TripCreationFormValues = z.infer<typeof tripCreationSchema>;

// Activity Schema
export const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  category: z.enum([
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
  ]),
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  duration_minutes: z.number().min(15).max(720),
  estimated_cost: z.number().min(0),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  opening_time: z.string().optional(),
  closing_time: z.string().optional(),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;

// Disruption Simulation Schema
export const disruptionSimulationSchema = z.object({
  type: z.enum(['VENUE_CLOSURE', 'FLIGHT_DELAY', 'HOTEL_CANCELLATION', 'WEATHER_RISK', 'TRANSIT_STRIKE', 'SCHEDULE_CONFLICT']),
  title: z.string().min(1),
  description: z.string().min(1),
  affected_entity_id: z.string().min(1),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
});

// AI Structured Output Validation Schemas
export const aiGeneratedActivitySchema = z.object({
  name: z.string(),
  category: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  duration_minutes: z.number(),
  estimated_cost: z.number(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  description: z.string().optional(),
  latitude: z.number().optional().default(15.4989),
  longitude: z.number().optional().default(73.8322),
  opening_time: z.string().optional().default('09:00'),
  closing_time: z.string().optional().default('20:00'),
  reason: z.string().optional(),
});

export const aiGeneratedDaySchema = z.object({
  day_number: z.number(),
  date: z.string(),
  theme: z.string().optional(),
  activities: z.array(aiGeneratedActivitySchema),
});

export const aiItineraryResponseSchema = z.object({
  destination: z.string(),
  currency: z.string().default('INR'),
  itinerary: z.array(aiGeneratedDaySchema),
});

export const aiReplanningResponseSchema = z.object({
  disruption_id: z.string().optional(),
  replaced_activity: z.string(),
  best_alternative: z.object({
    name: z.string(),
    category: z.string(),
    estimated_cost: z.number(),
    duration_minutes: z.number(),
    score: z.number(),
    reason: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  all_alternatives: z.array(z.any()).optional(),
  explanation: z.string(),
});
