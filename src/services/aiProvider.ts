import { z } from 'zod';
import { aiItineraryResponseSchema } from '../schemas';
import { TripCreationFormValues } from '../schemas';
import { ItineraryDay } from '../types';

export class AIProviderService {
  private static apiKey = import.meta.env.AI_API_KEY || '';
  private static model = import.meta.env.AI_MODEL || 'gemini-1.5-flash';

  public static isAIConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  public static async generateItinerary(
    input: TripCreationFormValues
  ): Promise<{ destination: string; currency: string; itinerary: ItineraryDay[] }> {
    // If external AI key is available, call API
    if (this.isAIConfigured()) {
      try {
        const result = await this.callExternalLLM(input);
        const parsed = aiItineraryResponseSchema.safeParse(result);
        if (parsed.success) {
          return {
            destination: parsed.data.destination,
            currency: parsed.data.currency,
            itinerary: parsed.data.itinerary.map((d) => ({
              id: `day-${d.day_number}-${Date.now()}`,
              trip_id: 'temp-id',
              date: d.date,
              day_number: d.day_number,
              theme: d.theme || `Day ${d.day_number} Sights`,
              activities: d.activities.map((a, aIdx) => ({
                id: `act-${d.day_number}-${aIdx}-${Date.now()}`,
                trip_id: 'temp-id',
                name: a.name,
                category: a.category as any,
                description: a.description || a.reason || '',
                latitude: a.latitude || 15.4989,
                longitude: a.longitude || 73.8322,
                start_time: a.start_time,
                end_time: a.end_time,
                duration_minutes: a.duration_minutes,
                estimated_cost: a.estimated_cost,
                priority: a.priority || 'MEDIUM',
                status: 'scheduled' as const,
                opening_time: a.opening_time,
                closing_time: a.closing_time,
              })),
            })),
          };
        }
      } catch (err) {
        console.warn('External AI call failed, falling back to deterministic generator:', err);
      }
    }

    // Deterministic High-Quality Generation
    return this.generateDeterministicItinerary(input);
  }

  private static async callExternalLLM(input: TripCreationFormValues): Promise<any> {
    const prompt = `You are TravelPilot's AI Engine. Generate a day-by-day JSON travel itinerary for:
Destination: ${input.destination}
Dates: ${input.startDate} to ${input.endDate}
Budget: ${input.budget} ${input.currency}
Interests: ${input.interests.join(', ')}
Style: ${input.travelStyle}
Transport: ${input.transportPreference}

Respond ONLY with a valid JSON object strictly matching this schema:
{
  "destination": "${input.destination}",
  "currency": "${input.currency}",
  "itinerary": [
    {
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "activities": [
        {
          "name": "string",
          "category": "Beaches|Adventure|Food|History|Culture|Shopping|Nature|Nightlife|Transit|Accommodation",
          "start_time": "HH:MM",
          "end_time": "HH:MM",
          "duration_minutes": 60,
          "estimated_cost": 500,
          "priority": "HIGH|MEDIUM|LOW",
          "description": "string",
          "latitude": 15.5,
          "longitude": 73.8,
          "opening_time": "09:00",
          "closing_time": "20:00"
        }
      ]
    }
  ]
}`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + this.apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text);
  }

  public static generateDeterministicItinerary(
    input: TripCreationFormValues
  ): { destination: string; currency: string; itinerary: ItineraryDay[] } {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const primaryInterest = input.interests[0] || 'Culture';
    const secondaryInterest = input.interests[1] || 'Food';
    const tertiaryInterest = input.interests[2] || 'Beaches';

    const dailyBudget = Math.round(input.budget / totalDays);

    const days: ItineraryDay[] = [];

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const curDate = new Date(start);
      curDate.setDate(start.getDate() + (dayNum - 1));
      const dateStr = curDate.toISOString().split('T')[0];

      let theme = `Discovering ${input.destination}`;
      if (dayNum === 1) theme = `Arrival, Check-in & Orientation in ${input.destination}`;
      else if (dayNum === totalDays) theme = `Final Highlights & Departure from ${input.destination}`;
      else if (dayNum === 2) theme = `${primaryInterest} & Heritage Trail`;
      else if (dayNum === 3) theme = `${secondaryInterest} & Scenic Escapes`;

      const acts: any[] = [];

      if (dayNum === 1) {
        acts.push(
          {
            id: `act-${dayNum}-1-${Date.now()}`,
            trip_id: 'temp',
            name: `Airport / Station Arrival Transfer to ${input.destination}`,
            category: 'Transit',
            description: `Scenic arrival transit to your central accommodation in ${input.destination}`,
            latitude: 15.5186,
            longitude: 73.7684,
            start_time: '10:00',
            end_time: '11:15',
            duration_minutes: 75,
            estimated_cost: Math.round(dailyBudget * 0.12),
            priority: 'HIGH',
            status: 'scheduled',
            opening_time: '00:00',
            closing_time: '23:59',
          },
          {
            id: `act-${dayNum}-2-${Date.now()}`,
            trip_id: 'temp',
            name: 'Accommodation Check-In & Freshen Up',
            category: 'Accommodation',
            description: 'Unpack luggage, check in and get oriented with the neighbourhood',
            latitude: 15.514,
            longitude: 73.766,
            start_time: '11:45',
            end_time: '12:45',
            duration_minutes: 60,
            estimated_cost: 0,
            priority: 'HIGH',
            status: 'scheduled',
            opening_time: '11:00',
            closing_time: '23:59',
          },
          {
            id: `act-${dayNum}-3-${Date.now()}`,
            trip_id: 'temp',
            name: `Traditional Welcome Lunch at ${input.destination}`,
            category: 'Food',
            description: 'Locally celebrated restaurant showcasing signature cuisine',
            latitude: 15.5152,
            longitude: 73.7675,
            start_time: '13:00',
            end_time: '14:30',
            duration_minutes: 90,
            estimated_cost: Math.round(dailyBudget * 0.15),
            priority: 'HIGH',
            status: 'scheduled',
            opening_time: '11:30',
            closing_time: '23:00',
          },
          {
            id: `act-${dayNum}-4-${Date.now()}`,
            trip_id: 'temp',
            name: `Scenic Sunset Walk & Promenade in ${input.destination}`,
            category: (input.interests.includes('Beaches') ? 'Beaches' : 'Nature') as any,
            description: 'Golden hour stroll along the iconic coastal or city promenade',
            latitude: 15.4988,
            longitude: 73.7672,
            start_time: '17:00',
            end_time: '19:00',
            duration_minutes: 120,
            estimated_cost: Math.round(dailyBudget * 0.08),
            priority: 'HIGH',
            status: 'scheduled',
            opening_time: '00:00',
            closing_time: '23:59',
          }
        );
      } else {
        acts.push(
          {
            id: `act-${dayNum}-1-${Date.now()}`,
            trip_id: 'temp',
            name: `Morning Landmark Discovery: ${input.destination} Highlights`,
            category: primaryInterest as any,
            description: `Guided exploration of major heritage and scenic sights`,
            latitude: 15.5028,
            longitude: 73.9125,
            start_time: '09:30',
            end_time: '12:00',
            duration_minutes: 150,
            estimated_cost: Math.round(dailyBudget * 0.15),
            priority: input.priorities?.[primaryInterest] || 'HIGH',
            status: 'scheduled',
            opening_time: '09:00',
            closing_time: '18:00',
          },
          {
            id: `act-${dayNum}-2-${Date.now()}`,
            trip_id: 'temp',
            name: 'Artisan Food Trail & Café Lunch',
            category: 'Food',
            description: 'Handpicked local café with celebrated regional delicacies',
            latitude: 15.4989,
            longitude: 73.8322,
            start_time: '12:30',
            end_time: '14:00',
            duration_minutes: 90,
            estimated_cost: Math.round(dailyBudget * 0.14),
            priority: 'HIGH',
            status: 'scheduled',
            opening_time: '11:00',
            closing_time: '22:00',
          },
          {
            id: `act-${dayNum}-3-${Date.now()}`,
            trip_id: 'temp',
            name: `Afternoon ${secondaryInterest} Immersion`,
            category: secondaryInterest as any,
            description: `Curated activity tailored to your ${secondaryInterest} preference`,
            latitude: 15.5439,
            longitude: 73.7554,
            start_time: '14:45',
            end_time: '17:15',
            duration_minutes: 150,
            estimated_cost: Math.round(dailyBudget * 0.18),
            priority: input.priorities?.[secondaryInterest] || 'MEDIUM',
            status: 'scheduled',
            opening_time: '09:30',
            closing_time: '19:00',
          },
          {
            id: `act-${dayNum}-4-${Date.now()}`,
            trip_id: 'temp',
            name: `Evening ${tertiaryInterest} & Dinner Experience`,
            category: tertiaryInterest as any,
            description: 'Vibrant evening atmosphere with dining and live ambient music',
            latitude: 15.5992,
            longitude: 73.7455,
            start_time: '18:00',
            end_time: '20:30',
            duration_minutes: 150,
            estimated_cost: Math.round(dailyBudget * 0.16),
            priority: input.priorities?.[tertiaryInterest] || 'MEDIUM',
            status: 'scheduled',
            opening_time: '17:00',
            closing_time: '23:30',
          }
        );
      }

      days.push({
        id: `day-${dayNum}-${Date.now()}`,
        trip_id: 'temp',
        day_number: dayNum,
        date: dateStr,
        theme,
        activities: acts,
      });
    }

    return {
      destination: input.destination,
      currency: input.currency || 'INR',
      itinerary: days,
    };
  }
}
