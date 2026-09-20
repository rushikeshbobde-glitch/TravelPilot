import { Trip, Disruption, Activity, ImpactRadiusResult, DisruptionSeverity } from '../types';
import { TravelDigitalTwin } from './travelTwin';
import { RouteOptimizer } from './routeOptimizer';

export class ImpactRadiusEngine {
  public static calculateImpact(trip: Trip, disruption: Partial<Disruption>): ImpactRadiusResult {
    const twin = new TravelDigitalTwin(trip);
    const allActivities = twin.getAllActivities();

    const directlyAffected: Activity[] = [];
    const potentiallyAffected: Activity[] = [];
    const unaffected: Activity[] = [];

    const affectedEntityId = disruption.affected_entity_id;
    const disruptionType = disruption.type || 'VENUE_CLOSURE';

    if (disruptionType === 'FLIGHT_DELAY') {
      // If flight is delayed on Day 1, all morning & afternoon activities on Day 1 are affected
      const day1 = (trip.days || [])[0];
      if (day1) {
        day1.activities.forEach((act, idx) => {
          if (idx < 2) {
            directlyAffected.push(act);
          } else if (idx === 2) {
            potentiallyAffected.push(act);
          } else {
            unaffected.push(act);
          }
        });
      }
      // Remaining days unaffected
      (trip.days || []).slice(1).forEach((d) => {
        unaffected.push(...d.activities);
      });
    } else if (disruptionType === 'HOTEL_CANCELLATION') {
      // Hotel affects accommodation check-in and evening relaxation
      allActivities.forEach((act) => {
        if (act.category === 'Accommodation' || act.id === affectedEntityId) {
          directlyAffected.push(act);
        } else if (act.category === 'Food' && RouteOptimizer.timeToMinutes(act.start_time) > 19 * 60) {
          potentiallyAffected.push(act);
        } else {
          unaffected.push(act);
        }
      });
    } else {
      // Standard activity closure or venue disruption
      const target = allActivities.find((a) => a.id === affectedEntityId);
      if (target) {
        directlyAffected.push(target);
        const downstream = twin.getDownstreamActivities(target.id);
        const directIds = new Set([target.id]);

        // Downstream activities immediately sequential are potentially affected
        downstream.forEach((ds) => {
          if (!directIds.has(ds.id)) {
            potentiallyAffected.push(ds);
          }
        });

        // Other activities on same day with start times after the target
        const targetDay = (trip.days || []).find((d) =>
          d.activities.some((a) => a.id === target.id)
        );
        if (targetDay) {
          const targetMinutes = RouteOptimizer.timeToMinutes(target.end_time);
          targetDay.activities.forEach((act) => {
            if (act.id !== target.id && !potentiallyAffected.some((p) => p.id === act.id)) {
              const actStart = RouteOptimizer.timeToMinutes(act.start_time);
              if (actStart >= targetMinutes && actStart <= targetMinutes + 90) {
                potentiallyAffected.push(act);
              }
            }
          });
        }
      }

      const affectedIds = new Set([
        ...directlyAffected.map((a) => a.id),
        ...potentiallyAffected.map((a) => a.id),
      ]);

      allActivities.forEach((act) => {
        if (!affectedIds.has(act.id)) {
          unaffected.push(act);
        }
      });
    }

    let severity: DisruptionSeverity = 'LOW';
    if (directlyAffected.length > 0) {
      if (potentiallyAffected.length >= 3 || disruptionType === 'HOTEL_CANCELLATION') {
        severity = 'CRITICAL';
      } else if (potentiallyAffected.length >= 1 || disruptionType === 'FLIGHT_DELAY') {
        severity = 'HIGH';
      } else {
        severity = 'MEDIUM';
      }
    }

    return {
      directly_affected: directlyAffected,
      potentially_affected: potentiallyAffected,
      unaffected: unaffected,
      direct_count: directlyAffected.length,
      potential_count: potentiallyAffected.length,
      unaffected_count: unaffected.length,
      severity,
      root_cause: disruption.title || 'Itinerary Schedule Disruption',
    };
  }
}
