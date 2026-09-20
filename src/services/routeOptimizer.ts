import { Activity, PriorityLevel } from '../types';

export interface RouteSegment {
  fromActivity: Activity;
  toActivity: Activity;
  distanceKm: number;
  estimatedTravelMinutes: number;
  isFeasible: boolean;
}

export class RouteOptimizer {
  // Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
  public static calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
  }

  // Estimate travel duration based on distance and average speed (30 km/h in urban/tourist regions)
  public static estimateTravelDuration(distanceKm: number, bufferMinutes = 10): number {
    if (distanceKm <= 0.3) return 5; // short walk
    const speedKmh = 30; // average urban transit speed
    const transitTime = (distanceKm / speedKmh) * 60;
    return Math.max(10, Math.round(transitTime + bufferMinutes));
  }

  // Parse "HH:MM" string to minutes from midnight
  public static timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  // Convert minutes from midnight to "HH:MM" string
  public static minutesToTime(totalMinutes: number): string {
    const mins = Math.max(0, Math.min(24 * 60 - 1, Math.round(totalMinutes)));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // Check if two activity time slots overlap
  public static hasTimeConflict(act1: Activity, act2: Activity): boolean {
    const start1 = this.timeToMinutes(act1.start_time);
    const end1 = this.timeToMinutes(act1.end_time);
    const start2 = this.timeToMinutes(act2.start_time);
    const end2 = this.timeToMinutes(act2.end_time);

    return Math.max(start1, start2) < Math.min(end1, end2);
  }

  // Check if an activity start & end time falls within venue operating hours
  public static isWithinOpeningHours(act: Activity): boolean {
    if (!act.opening_time || !act.closing_time) return true;
    const actStart = this.timeToMinutes(act.start_time);
    const actEnd = this.timeToMinutes(act.end_time);
    const open = this.timeToMinutes(act.opening_time);
    const close = this.timeToMinutes(act.closing_time);

    return actStart >= open && actEnd <= close;
  }

  // Compute Itinerary Fitness Score: lower penalty is better
  public static calculateItineraryScore(
    activities: Activity[],
    userPriorities: Record<string, PriorityLevel> = {},
    dailyBudgetLimit = 10000
  ): {
    totalScore: number;
    travelPenalty: number;
    conflictPenalty: number;
    budgetPenalty: number;
    waitingPenalty: number;
    preferenceScore: number;
  } {
    let travelPenalty = 0;
    let conflictPenalty = 0;
    let waitingPenalty = 0;
    let preferenceScore = 0;
    let totalCost = 0;

    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      totalCost += act.estimated_cost;

      // Preference Score bonus
      const prio = userPriorities[act.category] || act.priority || 'MEDIUM';
      if (prio === 'HIGH') preferenceScore += 50;
      else if (prio === 'MEDIUM') preferenceScore += 25;
      else preferenceScore += 10;

      // Check opening hours
      if (!this.isWithinOpeningHours(act)) {
        conflictPenalty += 100;
      }

      // Check transit and conflicts with next activity
      if (i < activities.length - 1) {
        const nextAct = activities[i + 1];
        const dist = this.calculateHaversineDistance(
          act.latitude,
          act.longitude,
          nextAct.latitude,
          nextAct.longitude
        );
        const neededTravelMins = this.estimateTravelDuration(dist);
        travelPenalty += Math.round(dist * 5 + neededTravelMins);

        const currentEnd = this.timeToMinutes(act.end_time);
        const nextStart = this.timeToMinutes(nextAct.start_time);
        const gap = nextStart - currentEnd;

        if (gap < neededTravelMins) {
          // Schedule collision or insufficient transit time
          conflictPenalty += 150;
        } else if (gap > neededTravelMins + 90) {
          // Excessive dead waiting time
          waitingPenalty += Math.round((gap - neededTravelMins) * 0.5);
        }
      }
    }

    const budgetPenalty = totalCost > dailyBudgetLimit ? Math.round((totalCost - dailyBudgetLimit) * 0.1) : 0;
    const totalScore = Math.max(
      0,
      1000 - (travelPenalty + conflictPenalty + budgetPenalty + waitingPenalty) + preferenceScore
    );

    return {
      totalScore,
      travelPenalty,
      conflictPenalty,
      budgetPenalty,
      waitingPenalty,
      preferenceScore,
    };
  }

  // Re-order activities to minimize total transit distance (Greedy Nearest Neighbor)
  public static optimizeActivityOrder(activities: Activity[]): Activity[] {
    if (activities.length <= 2) return activities;

    const fixedFirst = activities[0];
    const unvisited = [...activities.slice(1)];
    const ordered: Activity[] = [fixedFirst];

    let current = fixedFirst;
    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.calculateHaversineDistance(
          current.latitude,
          current.longitude,
          unvisited[i].latitude,
          unvisited[i].longitude
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      current = unvisited.splice(nearestIdx, 1)[0];
      ordered.push(current);
    }

    return ordered;
  }
}
