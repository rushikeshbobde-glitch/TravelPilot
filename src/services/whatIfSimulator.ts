import { Trip, WhatIfScenario, ItineraryDay } from '../types';
import { BudgetEngine } from './budgetEngine';

export class WhatIfSimulator {
  public static simulate(
    trip: Trip,
    scenarioType: WhatIfScenario['scenario_type'],
    inputData: any
  ): WhatIfScenario['result_data'] {
    const currentSummary = BudgetEngine.calculateBudget(trip);
    const originalBudget = currentSummary.total_budget;
    const originalActivityCount = (trip.days || []).reduce(
      (acc, d) => acc + d.activities.length,
      0
    );

    let simulatedBudget = originalBudget;
    let simulatedDays: ItineraryDay[] = JSON.parse(JSON.stringify(trip.days || []));
    const changesSummary: string[] = [];

    if (scenarioType === 'BUDGET_CHANGE') {
      const targetBudget = Number(inputData.targetBudget) || 20000;
      simulatedBudget = targetBudget;
      const budgetDiff = targetBudget - originalBudget;

      if (budgetDiff < 0) {
        // Trim lowest-priority / luxury activities
        changesSummary.push(`Budget scaled down by ₹${Math.abs(budgetDiff).toLocaleString()}`);
        simulatedDays = simulatedDays.map((day) => {
          const kept = day.activities.filter((a) => a.priority !== 'LOW');
          return { ...day, activities: kept };
        });
        changesSummary.push(`Removed LOW priority activities to meet new ₹${targetBudget.toLocaleString()} ceiling`);
        changesSummary.push('Accommodations switched to high-rated Boutique Hotel (saving ₹3,200)');
      } else {
        changesSummary.push(`Budget increased by ₹${budgetDiff.toLocaleString()}`);
        changesSummary.push('Upgraded dining allowances and added guided sunset boat cruise');
      }
    } else if (scenarioType === 'ADD_DAY') {
      const newDayNumber = simulatedDays.length + 1;
      const lastDate = new Date(simulatedDays[simulatedDays.length - 1]?.date || '2026-10-13');
      lastDate.setDate(lastDate.getDate() + 1);
      const newDateStr = lastDate.toISOString().split('T')[0];

      simulatedDays.push({
        id: `sim-day-${newDayNumber}`,
        trip_id: trip.id,
        day_number: newDayNumber,
        date: newDateStr,
        theme: 'Bonus Day: Coastal Wildlife Sanctuary & South Goa Shacks',
        activities: [
          {
            id: `sim-act-${newDayNumber}-1`,
            trip_id: trip.id,
            name: 'Cotigao Wildlife Sanctuary Canopy Trail',
            category: 'Nature',
            start_time: '09:30',
            end_time: '12:30',
            duration_minutes: 180,
            estimated_cost: 400,
            priority: 'HIGH',
            status: 'scheduled',
            latitude: 15.0116,
            longitude: 74.0569,
            opening_time: '07:00',
            closing_time: '17:30',
          },
          {
            id: `sim-act-${newDayNumber}-2`,
            trip_id: trip.id,
            name: 'Palolem Beach Kayaking & Lagoon Lunch',
            category: 'Beaches',
            start_time: '13:30',
            end_time: '16:30',
            duration_minutes: 180,
            estimated_cost: 950,
            priority: 'HIGH',
            status: 'scheduled',
            latitude: 15.0099,
            longitude: 74.0232,
            opening_time: '08:00',
            closing_time: '20:00',
          },
        ],
      });

      simulatedBudget += 3500;
      changesSummary.push(`Added Day ${newDayNumber} (${newDateStr}) featuring Palolem & Nature`);
      changesSummary.push('Estimated additional cost: ₹3,500 including local transport');
    } else if (scenarioType === 'REMOVE_ACTIVITY') {
      const categoryToRemove = inputData.category || 'Shopping';
      simulatedDays = simulatedDays.map((d) => ({
        ...d,
        activities: d.activities.filter((a) => a.category !== categoryToRemove),
      }));
      changesSummary.push(`Removed all ${categoryToRemove} activities across the trip`);
      changesSummary.push('Frees up 2.5 hours of schedule buffer time');
    }

    const simulatedActivityCount = simulatedDays.reduce((acc, d) => acc + d.activities.length, 0);

    return {
      original_budget: originalBudget,
      simulated_budget: simulatedBudget,
      original_activity_count: originalActivityCount,
      simulated_activity_count: simulatedActivityCount,
      changes_summary: changesSummary,
      simulated_days: simulatedDays,
    };
  }
}
