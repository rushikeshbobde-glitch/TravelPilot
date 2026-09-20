import { describe, it, expect } from 'vitest';
import { RouteOptimizer } from '../../src/services/routeOptimizer';
import { Activity } from '../../src/types';

describe('RouteOptimizer Unit Tests', () => {
  it('should calculate Haversine distance between two coordinates in km', () => {
    // Distance between Fort Aguada (15.4925, 73.7736) and Old Goa (15.5028, 73.9125)
    const distance = RouteOptimizer.calculateHaversineDistance(15.4925, 73.7736, 15.5028, 73.9125);
    expect(distance).toBeGreaterThan(10);
    expect(distance).toBeLessThan(20);
  });

  it('should detect time overlap between two conflicting activities', () => {
    const act1: Activity = {
      id: 'a1',
      trip_id: 't1',
      name: 'Morning Museum',
      category: 'History',
      start_time: '10:00',
      end_time: '12:00',
      duration_minutes: 120,
      estimated_cost: 100,
      priority: 'HIGH',
      status: 'scheduled',
      latitude: 15.5,
      longitude: 73.8,
    };

    const act2: Activity = {
      id: 'a2',
      trip_id: 't1',
      name: 'Overlapping Lunch',
      category: 'Food',
      start_time: '11:30', // Starts before act1 ends
      end_time: '13:00',
      duration_minutes: 90,
      estimated_cost: 400,
      priority: 'HIGH',
      status: 'scheduled',
      latitude: 15.5,
      longitude: 73.8,
    };

    expect(RouteOptimizer.hasTimeConflict(act1, act2)).toBe(true);
  });

  it('should validate opening hours correctly', () => {
    const act: Activity = {
      id: 'a1',
      trip_id: 't1',
      name: 'Nightclub Visit',
      category: 'Nightlife',
      start_time: '20:00',
      end_time: '23:00',
      opening_time: '18:00',
      closing_time: '23:30',
      duration_minutes: 180,
      estimated_cost: 1000,
      priority: 'MEDIUM',
      status: 'scheduled',
      latitude: 15.5,
      longitude: 73.8,
    };

    expect(RouteOptimizer.isWithinOpeningHours(act)).toBe(true);

    const invalidAct = {
      ...act,
      start_time: '10:00', // Before opening at 18:00
      end_time: '13:00',
    };
    expect(RouteOptimizer.isWithinOpeningHours(invalidAct)).toBe(false);
  });
});
