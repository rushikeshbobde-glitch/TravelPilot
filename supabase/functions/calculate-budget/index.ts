// Supabase Edge Function: calculate-budget
// Deterministic budget calculations across categories and dates

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
    const { total_budget = 0, expenses = [], activities = [], bookings = [] } = await req.json();

    const categories: Record<string, number> = {
      Accommodation: 0,
      Transportation: 0,
      Activities: 0,
      Food: 0,
      "Local Travel": 0,
      Other: 0
    };

    // Calculate from logged expenses
    expenses.forEach((e: any) => {
      const cat = categories[e.category] !== undefined ? e.category : "Other";
      categories[cat] += Number(e.amount || 0);
    });

    // Add activity costs if not already in expenses
    let activityTotal = 0;
    activities.forEach((a: any) => {
      activityTotal += Number(a.estimated_cost || 0);
    });
    if (categories["Activities"] === 0) {
      categories["Activities"] = activityTotal;
    }

    const totalSpent = Object.values(categories).reduce((sum, v) => sum + v, 0);
    const remaining = Number(total_budget) - totalSpent;
    const utilizationPct = total_budget > 0 ? Math.min(100, Math.round((totalSpent / total_budget) * 100)) : 0;

    return new Response(
      JSON.stringify({
        success: true,
        total_budget: Number(total_budget),
        total_spent: totalSpent,
        remaining_budget: remaining,
        utilization_percentage: utilizationPct,
        breakdown_by_category: categories,
        is_over_budget: remaining < 0
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to calculate budget" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
