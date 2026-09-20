import { Trip, BudgetSummary } from '../types';

export class BudgetEngine {
  public static calculateBudget(trip: Trip): BudgetSummary {
    const totalBudget = Number(trip.budget) || 0;
    const currency = trip.currency || 'INR';

    const breakdown: BudgetSummary['breakdown_by_category'] = {
      Accommodation: 0,
      Transportation: 0,
      Activities: 0,
      Food: 0,
      'Local Travel': 0,
      Other: 0,
    };

    // 1. Process explicit logged expenses
    const expenses = trip.expenses || [];
    expenses.forEach((e) => {
      const cat = e.category in breakdown ? e.category : 'Other';
      breakdown[cat] += Number(e.amount) || 0;
    });

    // 2. Process Bookings if not already counted in expenses
    const bookings = trip.bookings || [];
    bookings.forEach((b) => {
      if (b.status === 'CANCELLED') return;
      if (b.type === 'Flight' && breakdown.Transportation === 0) {
        breakdown.Transportation += Number(b.cost) || 0;
      } else if (b.type === 'Hotel' && breakdown.Accommodation === 0) {
        breakdown.Accommodation += Number(b.cost) || 0;
      }
    });

    // 3. Process Activities costs from daily itineraries
    let activityTotal = 0;
    let foodTotal = 0;
    let localTransitTotal = 0;
    const dailyMap = new Map<number, { date: string; amount: number }>();

    (trip.days || []).forEach((d) => {
      let daySum = 0;
      (d.activities || []).forEach((a) => {
        if (a.status === 'cancelled') return;
        const cost = Number(a.estimated_cost) || 0;
        daySum += cost;

        if (a.category === 'Food') {
          foodTotal += cost;
        } else if (a.category === 'Transit') {
          localTransitTotal += cost;
        } else if (a.category !== 'Accommodation') {
          activityTotal += cost;
        }
      });

      dailyMap.set(d.day_number, {
        date: d.date,
        amount: daySum,
      });
    });

    if (breakdown.Activities === 0) breakdown.Activities = activityTotal;
    if (breakdown.Food === 0) breakdown.Food = foodTotal;
    if (breakdown['Local Travel'] === 0) breakdown['Local Travel'] = localTransitTotal;

    const totalSpent = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
    const remainingBudget = totalBudget - totalSpent;
    const utilizationPercentage =
      totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

    const dailySpend = Array.from(dailyMap.entries())
      .map(([day_number, val]) => ({
        day_number,
        date: val.date,
        amount: val.amount,
      }))
      .sort((a, b) => a.day_number - b.day_number);

    return {
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining_budget: remainingBudget,
      utilization_percentage: utilizationPercentage,
      is_over_budget: remainingBudget < 0,
      currency,
      breakdown_by_category: breakdown,
      daily_spend: dailySpend,
    };
  }

  public static formatCurrency(amount: number, currency = 'INR'): string {
    const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }
}
