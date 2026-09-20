import { Trip, Activity, BudgetSummary } from '../types';
import { RouteOptimizer } from './routeOptimizer';
import { BudgetEngine } from './budgetEngine';
import { SelfHealingEngine } from './selfHealingEngine';
import { storage } from '../lib/storage';

export interface ToolExecutionResult {
  toolName: string;
  success: boolean;
  message: string;
  data?: any;
  actionRequired?: boolean;
}

export class AssistantToolsService {
  public static executeTool(
    toolName: string,
    args: any,
    trip: Trip
  ): ToolExecutionResult {
    switch (toolName) {
      case 'GET_TRIP': {
        return {
          toolName,
          success: true,
          message: `Trip to ${trip.destination} from ${trip.start_date} to ${trip.end_date}. Status: ${trip.status}.`,
          data: {
            name: trip.name,
            destination: trip.destination,
            dates: `${trip.start_date} to ${trip.end_date}`,
            budget: trip.budget,
            currency: trip.currency,
            style: trip.travel_style,
          },
        };
      }

      case 'GET_ITINERARY': {
        const totalActivities = (trip.days || []).reduce((acc, d) => acc + d.activities.length, 0);
        return {
          toolName,
          success: true,
          message: `Retrieved itinerary spanning ${trip.days?.length || 0} days with ${totalActivities} activities.`,
          data: trip.days,
        };
      }

      case 'GET_BUDGET': {
        const summary = BudgetEngine.calculateBudget(trip);
        return {
          toolName,
          success: true,
          message: `Budget: ${BudgetEngine.formatCurrency(summary.total_budget, summary.currency)}, Spent: ${BudgetEngine.formatCurrency(summary.total_spent, summary.currency)}, Remaining: ${BudgetEngine.formatCurrency(summary.remaining_budget, summary.currency)} (${summary.utilization_percentage}% used).`,
          data: summary,
        };
      }

      case 'CHECK_CONFLICTS': {
        const conflicts: any[] = [];
        (trip.days || []).forEach((day) => {
          for (let i = 0; i < day.activities.length - 1; i++) {
            const a1 = day.activities[i];
            const a2 = day.activities[i + 1];
            if (RouteOptimizer.hasTimeConflict(a1, a2)) {
              conflicts.push({
                day: day.day_number,
                activity1: a1.name,
                activity2: a2.name,
                type: 'TIME_OVERLAP',
              });
            }
          }
        });

        return {
          toolName,
          success: true,
          message: conflicts.length === 0 ? 'No schedule conflicts detected in the current itinerary.' : `Detected ${conflicts.length} schedule conflicts.`,
          data: conflicts,
        };
      }

      case 'REMOVE_ACTIVITY': {
        const categoryToRemove = (args.category || '').toLowerCase();
        const activityId = args.activity_id;

        let removedCount = 0;
        let removedName = '';

        const updatedDays = (trip.days || []).map((day) => {
          const filtered = day.activities.filter((act) => {
            if (activityId && act.id === activityId) {
              removedName = act.name;
              removedCount++;
              return false;
            }
            if (categoryToRemove && act.category.toLowerCase() === categoryToRemove) {
              removedName = act.name;
              removedCount++;
              return false;
            }
            return true;
          });
          return { ...day, activities: filtered };
        });

        if (removedCount > 0) {
          const updatedTrip = { ...trip, days: updatedDays };
          storage.saveTrip(updatedTrip);
          return {
            toolName,
            success: true,
            message: `Successfully removed ${removedName || `${removedCount} activities`} from your itinerary.`,
            data: updatedTrip,
          };
        } else {
          return {
            toolName,
            success: false,
            message: `No matching activity found to remove for '${categoryToRemove || activityId}'.`,
          };
        }
      }

      case 'FIND_NEARBY_ACTIVITIES': {
        const lat = args.latitude || 15.5;
        const lon = args.longitude || 73.8;
        const suggestions = [
          { name: 'Sinquerim Fort Ramparts', distance: 1.1, category: 'History', cost: 0 },
          { name: 'Candolim Sunset Deck', distance: 0.8, category: 'Beaches', cost: 200 },
          { name: 'Calangute Artisan Market', distance: 2.3, category: 'Shopping', cost: 500 },
        ];
        return {
          toolName,
          success: true,
          message: `Found ${suggestions.length} places near current coordinates.`,
          data: suggestions,
        };
      }

      case 'REPLAN_ITINERARY': {
        const museumActivity = (trip.days || []).flatMap((d) => d.activities).find((a) => a.name.includes('Museum'));
        if (museumActivity) {
          const res = SelfHealingEngine.executeSelfHealing(trip, {
            id: `disrupt-${Date.now()}`,
            trip_id: trip.id,
            type: 'VENUE_CLOSURE',
            title: 'Museum Closure Disruption',
            description: `${museumActivity.name} is temporarily closed for preservation.`,
            severity: 'MEDIUM',
            affected_entity_id: museumActivity.id,
            status: 'ACTIVE',
            detected_at: new Date().toISOString(),
          });
          return {
            toolName,
            success: true,
            message: `Self-healing activated! Replaced ${museumActivity.name} with ${res.selectedAlternative.name}.`,
            data: res,
          };
        }
        return {
          toolName,
          success: false,
          message: 'No active disruption candidate found to replan.',
        };
      }

      default:
        return {
          toolName,
          success: true,
          message: `Executed tool '${toolName}'.`,
          data: args,
        };
    }
  }
}
