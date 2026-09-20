import { describe, it, expect } from 'vitest';
import { WhatIfSimulator } from '../../src/services/whatIfSimulator';
import { INITIAL_GOA_TRIP } from '../../src/lib/mockData';

describe('WhatIfSimulator Unit Tests', () => {
  it('should scale down budget and remove low-priority activities', () => {
    const res = WhatIfSimulator.simulate(INITIAL_GOA_TRIP, 'BUDGET_CHANGE', {
      targetBudget: 20000,
    });

    expect(res.original_budget).toBe(25000);
    expect(res.simulated_budget).toBe(20000);
    expect(res.changes_summary.length).toBeGreaterThan(0);
  });

  it('should simulate adding an extra exploration day', () => {
    const res = WhatIfSimulator.simulate(INITIAL_GOA_TRIP, 'ADD_DAY', {});

    expect(res.simulated_days.length).toBe((INITIAL_GOA_TRIP.days?.length || 4) + 1);
    expect(res.simulated_budget).toBeGreaterThan(res.original_budget);
  });

  it('should simulate removing a specific category like Shopping', () => {
    const res = WhatIfSimulator.simulate(INITIAL_GOA_TRIP, 'REMOVE_ACTIVITY', {
      category: 'Shopping',
    });

    const hasShopping = res.simulated_days.some((d) =>
      d.activities.some((a) => a.category === 'Shopping')
    );
    expect(hasShopping).toBe(false);
  });
});
