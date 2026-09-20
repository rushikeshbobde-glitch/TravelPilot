import { describe, it, expect } from 'vitest';
import { SelfHealingEngine } from '../../src/services/selfHealingEngine';
import { BudgetEngine } from '../../src/services/budgetEngine';
import { INITIAL_GOA_TRIP, GOA_CANDIDATE_ALTERNATIVES } from '../../src/lib/mockData';
import { Disruption } from '../../src/types';

describe('E2E Golden Scenario Test - Goa Trip Self-Healing Pipeline', () => {
  it('executes full E2E disruption, impact radius, alternative selection, and budget recalculation', () => {
    // 1. Initial State: Goa 4-day trip with ₹25,000 budget
    const trip = { ...INITIAL_GOA_TRIP };
    expect(trip.destination).toBe('Goa, India');
    expect(trip.budget).toBe(25000);

    const initialBudgetSummary = BudgetEngine.calculateBudget(trip);
    expect(initialBudgetSummary.total_budget).toBe(25000);

    // 2. Locate Museum activity in Day 2
    const day2 = trip.days![1];
    const museumActivity = day2.activities.find((a) => a.name.includes('Archaeological Museum'));
    expect(museumActivity).toBeDefined();

    // 3. Trigger Disruption: Museum Closure
    const disruption: Disruption = {
      id: `disrupt-e2e-${Date.now()}`,
      trip_id: trip.id,
      type: 'VENUE_CLOSURE',
      title: 'Archaeological Museum Maintenance Closure',
      description: 'The Archaeological Survey of India has closed the venue for emergency preservation.',
      severity: 'MEDIUM',
      affected_entity_id: museumActivity!.id,
      status: 'ACTIVE',
      detected_at: new Date().toISOString(),
    };

    // 4. Execute Self-Healing Replanning
    const healingResult = SelfHealingEngine.executeSelfHealing(
      trip,
      disruption,
      GOA_CANDIDATE_ALTERNATIVES
    );

    // 5. Verify Impact Radius
    expect(healingResult.impactRadius.direct_count).toBe(1);
    expect(healingResult.impactRadius.directly_affected[0].id).toBe(museumActivity!.id);
    expect(healingResult.impactRadius.unaffected_count).toBeGreaterThan(0);

    // 6. Verify Selected Alternative
    expect(healingResult.selectedAlternative.name).toBe('Goa State Museum & Cultural Gallery');
    expect(healingResult.selectedAlternative.category).toBe('History');
    expect(healingResult.selectedAlternative.cost).toBeLessThanOrEqual(museumActivity!.estimated_cost);

    // 7. Verify Itinerary Day 2 Updated & Other Days Unaffected
    const updatedDay2 = healingResult.updatedTrip.days![1];
    expect(updatedDay2.activities[0].name).toBe('Goa State Museum & Cultural Gallery');
    expect(updatedDay2.activities[1].name).toBe('Basilica of Bom Jesus Heritage Walk'); // Preserved

    const updatedDay1 = healingResult.updatedTrip.days![0];
    expect(updatedDay1.activities[3].name).toBe('Fort Aguada & Lighthouse Exploration'); // Preserved

    // 8. Verify Budget Recalculated Deterministically
    const newBudgetSummary = BudgetEngine.calculateBudget(healingResult.updatedTrip);
    expect(newBudgetSummary.total_budget).toBe(25000);
    expect(newBudgetSummary.is_over_budget).toBe(false);

    // 9. Verify Explainable AI Reasons & Priority Preservation
    expect(healingResult.explanation.priorityPreserved).toBe(true);
    expect(healingResult.explanation.whatChanged).toContain('Goa State Museum');
    expect(healingResult.explanation.costChange).toContain('cheaper');
    expect(healingResult.explanation.reasons.length).toBeGreaterThanOrEqual(4);

    // 10. Verify Audit ChangeLog Created
    expect(healingResult.changeLog.change_type).toBe('ACTIVITY_REPLACED');
    expect(healingResult.changeLog.trip_id).toBe(trip.id);
  });
});
