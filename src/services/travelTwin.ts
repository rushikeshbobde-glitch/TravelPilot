import { Trip, Activity, Booking, ActivityDependency } from '../types';

export class TravelDigitalTwin {
  private trip: Trip;
  private dependencies: ActivityDependency[];

  constructor(trip: Trip, dependencies: ActivityDependency[] = []) {
    this.trip = trip;
    this.dependencies = dependencies.length > 0 ? dependencies : this.extractImplicitDependencies(trip);
  }

  private extractImplicitDependencies(trip: Trip): ActivityDependency[] {
    const deps: ActivityDependency[] = [];
    const days = trip.days || [];

    for (const day of days) {
      const acts = day.activities || [];
      for (let i = 1; i < acts.length; i++) {
        const prev = acts[i - 1];
        const curr = acts[i];
        deps.push({
          id: `dep-${prev.id}-${curr.id}`,
          activity_id: curr.id,
          depends_on_activity_id: prev.id,
          dependency_type: prev.category === 'Transit' ? 'TRANSIT_CONNECTION' : 'REQUIRES_COMPLETION',
        });
      }
    }
    return deps;
  }

  public getAllActivities(): Activity[] {
    const list: Activity[] = [];
    (this.trip.days || []).forEach((d) => {
      list.push(...(d.activities || []));
    });
    return list;
  }

  public getActivityById(id: string): Activity | undefined {
    return this.getAllActivities().find((a) => a.id === id);
  }

  public getDownstreamActivities(activityId: string): Activity[] {
    const downstreamIds = new Set<string>();
    const queue = [activityId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const directChildren = this.dependencies
        .filter((d) => d.depends_on_activity_id === currentId)
        .map((d) => d.activity_id);

      for (const childId of directChildren) {
        if (!downstreamIds.has(childId)) {
          downstreamIds.add(childId);
          queue.push(childId);
        }
      }
    }

    return this.getAllActivities().filter((a) => downstreamIds.has(a.id));
  }

  public getUpstreamActivities(activityId: string): Activity[] {
    const upstreamIds = new Set<string>();
    const queue = [activityId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const directParents = this.dependencies
        .filter((d) => d.activity_id === currentId)
        .map((d) => d.depends_on_activity_id);

      for (const parentId of directParents) {
        if (!upstreamIds.has(parentId)) {
          upstreamIds.add(parentId);
          queue.push(parentId);
        }
      }
    }

    return this.getAllActivities().filter((a) => upstreamIds.has(a.id));
  }

  public getBookings(): Booking[] {
    return this.trip.bookings || [];
  }
}
