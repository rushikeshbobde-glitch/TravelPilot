import { describe, it, expect } from 'vitest';
import { BudgetEngine } from '../../src/services/budgetEngine';
import { INITIAL_GOA_TRIP } from '../../src/lib/mockData';

describe('BudgetEngine Unit Tests', () => {
  it('should correctly calculate total budget and breakdown for the Goa trip', () => {
    const summary = BudgetEngine.calculateBudget(INITIAL_GOA_TRIP);

    expect(summary.total_budget).toBe(25000);
    expect(summary.currency).toBe('INR');
    expect(summary.breakdown_by_category.Accommodation).toBe(9200);
    expect(summary.breakdown_by_category.Transportation).toBe(5800);
    expect(summary.breakdown_by_category['Local Travel']).toBe(2400);

    expect(summary.total_spent).toBeGreaterThan(0);
    expect(summary.remaining_budget).toBe(25000 - summary.total_spent);
    expect(summary.utilization_percentage).toBeGreaterThan(0);
    expect(summary.is_over_budget).toBe(false);
  });

  it('should detect when an itinerary exceeds the total budget', () => {
    const overbudgetTrip = {
      ...INITIAL_GOA_TRIP,
      budget: 15000, // Reduced below total spend
    };

    const summary = BudgetEngine.calculateBudget(overbudgetTrip);
    expect(summary.is_over_budget).toBe(true);
    expect(summary.remaining_budget).toBeLessThan(0);
  });

  it('should format currency accurately', () => {
    expect(BudgetEngine.formatCurrency(25000, 'INR')).toBe('₹25,000');
    expect(BudgetEngine.formatCurrency(1500, 'USD')).toBe('$1,500');
    expect(BudgetEngine.formatCurrency(2000, 'EUR')).toBe('€2,000');
  });
});
