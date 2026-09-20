import { describe, it, expect } from 'vitest';
import { SelfHealingEngine } from '../../src/services/selfHealingEngine';
import { INITIAL_GOA_TRIP, GOA_CANDIDATE_ALTERNATIVES } from '../../src/lib/mockData';
import { Disruption } from '../../src/types';

describe('SelfHealingEngine Unit Tests - Golden Scenario', () => {
  it('should autonomously replan when Archaeological Museum of Goa closes', () => {
    const museumActivity = INITIAL_GOA_TRIP.days![1].activities[0];

    const disruption: Disruption = {
      id: 'disp-test-01',
      trip_id: INITIAL_GOA_TRIP.id,
      type: 'VENUE_CLOSURE',
      title: 'Archaeological Museum Maintenance Closure',
      description: 'Venue closed for restoration.',
      severity: 'MEDIUM',
      affected_entity_id: museumActivity.id,
      status: 'ACTIVE',
      detected_at: new Date().toISOString(),
    };

    const result = SelfHealingEngine.executeSelfHealing(
      INITIAL_GOA_TRIP,
      disruption,
      GOA_CANDIDATE_ALTERNATIVES
    );

    // Verify replacement selected
    expect(result.selectedAlternative).toBeDefined();
    expect(result.selectedAlternative.name).toContain('Goa State Museum');
    expect(result.selectedAlternative.category).toBe('History');

    // Verify that updated trip has the new activity in place
    const updatedDay2 = result.updatedTrip.days![1];
    const newAct = updatedDay2.activities[0];
    expect(newAct.name).toBe(result.selectedAlternative.name);
    expect(newAct.status).toBe('scheduled');

    // Verify explainable AI structure
    expect(result.explanation.whatChanged).toContain('Goa State Museum');
    expect(result.explanation.why).toBeDefined();
    expect(result.explanation.costChange).toBeDefined();
    expect(result.explanation.reasons.length).toBeGreaterThan(0);
    expect(result.explanation.priorityPreserved).toBe(true);

    // Verify changelog created
    expect(result.changeLog.change_type).toBe('ACTIVITY_REPLACED');
  });
});
