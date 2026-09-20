// Supabase Edge Function: generate-itinerary
// Generates structured day-by-day itinerary based on preferences and budget constraints

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
    const { destination, startDate, endDate, budget, currency = "INR", travelStyle = "Balanced", interests = [], priorities = {} } = await req.json();

    if (!destination || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required trip parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deterministic generation fallback for edge runtime
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const generatedDays = [];
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const currentDayDate = new Date(start);
      currentDayDate.setDate(start.getDate() + (dayNum - 1));
      const dateStr = currentDayDate.toISOString().split("T")[0];

      generatedDays.push({
        day_number: dayNum,
        date: dateStr,
        theme: dayNum === 1 ? "Arrival & Orientation" : dayNum === totalDays ? "Highlights & Departure" : `Exploration & Culture Day ${dayNum}`,
        activities: [
          {
            name: dayNum === 1 ? `Arrival in ${destination}` : `Morning Scenic Tour of ${destination}`,
            category: dayNum === 1 ? "Transit" : (interests[0] || "Culture"),
            start_time: "09:30",
            end_time: "11:30",
            duration_minutes: 120,
            estimated_cost: Math.round((budget * 0.05) / totalDays),
            priority: priorities[interests[0]] || "HIGH",
            description: `Scenic exploration and prime sights in ${destination}`
          },
          {
            name: `Authentic Local Cuisine at ${destination}`,
            category: "Food",
            start_time: "12:30",
            end_time: "14:00",
            duration_minutes: 90,
            estimated_cost: Math.round((budget * 0.08) / totalDays),
            priority: "HIGH",
            description: `Signature culinary specialties of ${destination}`
          },
          {
            name: `Afternoon ${interests[1] || "Landmarks"} Experience`,
            category: interests[1] || "History",
            start_time: "15:00",
            end_time: "17:30",
            duration_minutes: 150,
            estimated_cost: Math.round((budget * 0.06) / totalDays),
            priority: priorities[interests[1]] || "MEDIUM",
            description: `Immersive cultural or outdoor experience`
          },
          {
            name: `Sunset & Evening Leisure`,
            category: interests[2] || "Beaches",
            start_time: "18:00",
            end_time: "20:30",
            duration_minutes: 150,
            estimated_cost: Math.round((budget * 0.04) / totalDays),
            priority: "MEDIUM",
            description: `Panoramic sunset spot and evening relaxation`
          }
        ]
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        destination,
        total_days: totalDays,
        currency,
        itinerary: generatedDays
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || "Failed to generate itinerary" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
