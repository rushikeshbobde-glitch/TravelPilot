import { describe, it, expect } from 'vitest';
import { ImpactRadiusEngine } from '../../src/services/impactRadiusEngine';
import { INITIAL_GOA_TRIP } from '../../src/lib/mockData';

describe('ImpactRadiusEngine Unit Tests', () => {
  it('should correctly classify direct, potential, and unaffected nodes for Museum Closure', () => {
    const museumActivity = INITIAL_GOA_TRIP.days![1].activities[0]; // Day 2: Archaeological Museum of Goa

    const impact = ImpactRadiusEngine.calculateImpact(INITIAL_GOA_TRIP, {
      type: 'VENUE_CLOSURE',
      affected_entity_id: museumActivity.id,
      title: 'Museum Closure',
    });

    expect(impact.direct_count).toBe(1);
    expect(impact.directly_affected[0].id).toBe(museumActivity.id);
    expect(impact.potentially_affected.length).toBeGreaterThanOrEqual(1);
    expect(impact.unaffected_count).toBeGreaterThan(0);
    expect(impact.severity).toBeDefined();
  });

  it('should handle flight delay cascade correctly', () => {
    const impact = ImpactRadiusEngine.calculateImpact(INITIAL_GOA_TRIP, {
      type: 'FLIGHT_DELAY',
      title: 'Flight Delay +2h',
    });

    expect(impact.direct_count).toBeGreaterThan(0);
    expect(impact.severity).toBe('HIGH');
  });
});
