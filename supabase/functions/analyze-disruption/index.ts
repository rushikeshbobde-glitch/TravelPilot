// Supabase Edge Function: analyze-disruption
// Computes Impact Radius and dependency cascade for an unexpected travel event

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { disruption_type, affected_entity_id, activities = [], dependencies = [] } = await req.json();

    // Directly affected: the primary target
    const directlyAffected = activities.filter((a: any) => a.id === affected_entity_id);
    
    // Potentially affected: downstream dependencies or subsequent items in same day
    const directIds = new Set(directlyAffected.map((a: any) => a.id));
    const potentiallyAffectedIds = new Set<string>();

    dependencies.forEach((dep: any) => {
      if (directIds.has(dep.depends_on_activity_id)) {
        potentiallyAffectedIds.add(dep.activity_id);
      }
    });

    const potentiallyAffected = activities.filter((a: any) => potentiallyAffectedIds.has(a.id));
    const unaffected = activities.filter((a: any) => !directIds.has(a.id) && !potentiallyAffectedIds.has(a.id));

    return new Response(
      JSON.stringify({
        success: true,
        impact_radius: {
          directly_affected_count: directlyAffected.length,
          potentially_affected_count: potentiallyAffected.length,
          unaffected_count: unaffected.length,
          directly_affected: directlyAffected,
          potentially_affected: potentiallyAffected,
          unaffected: unaffected
        },
        severity: directlyAffected.length > 0 ? (potentiallyAffected.length > 2 ? "HIGH" : "MEDIUM") : "LOW"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to analyze disruption" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
