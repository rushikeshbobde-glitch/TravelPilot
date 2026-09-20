# TravelPilot 🧭✈️
### *"Your Trip That Heals Itself."*

TravelPilot is an autonomous, AI-powered travel management platform that models your entire journey as an interconnected **Travel Digital Twin** (flights, accommodation, activities, transits, budgets, priorities, and dependency chains). When disruptions occur—such as sudden flight delays, venue closures, hotel cancellations, or coastal squalls—TravelPilot detects the event, maps the **Impact Radius**, and automatically heals the affected schedule using deterministic optimization, preserving high-priority interests, recalculating budgets, and delivering transparent explainable reasoning.

---

## 🌟 Key Features

1. **Travel Digital Twin**: Graph-based representation linking flight arrival ➔ airport transit ➔ hotel check-in ➔ sightseeing activities.
2. **Impact Radius Engine**: Categorizes disruption scope across 3 tiers:
   - 🔴 **Directly Affected**: Primary failure node.
   - 🟡 **Potentially Affected**: Cascading downstream dependencies or tight time-slot shifts.
   - 🟢 **Unaffected**: Activities that require zero modification.
3. **Autonomous Self-Healing Replanning**:
   - Scores candidate alternatives using distance, cost, opening times, and user interest priority weights.
   - Preserves `HIGH` priority activities whenever possible.
   - Rebuilds only the affected portions of the day while leaving upstream/downstream schedules intact.
4. **Explainable AI (XAI)**: Generates human-readable audit cards showing:
   - *What Changed*
   - *Why*
   - *Budget Delta*
   - *Schedule Delta*
   - *Specific Selection Rationale*
5. **Deterministic Budget Engine**: Rigorous arithmetic for accommodation, transportation, activities, dining, and local transit.
6. **Risk Radar**: Proactive sentinel monitoring weather squalls, transit lag, and activity maintenance risks with actionable mitigation advice.
7. **What-If Scenario Simulator**: Sandboxed hypothesis testing (e.g. scale budget from ₹25k to ₹20k, add Day 5 in South Goa, or trim shopping) with side-by-side comparison before committing.
8. **AI Assistant with Tool Execution**: Natural-language conversational agent connected to tools: `GET_TRIP`, `GET_ITINERARY`, `GET_BUDGET`, `CHECK_CONFLICTS`, `REMOVE_ACTIVITY`, `FIND_NEARBY_ACTIVITIES`, and `REPLAN_ITINERARY`.
9. **Dual Backend & Zero-Config Demo Mode**: Full native support for live Supabase PostgreSQL + Edge Functions, as well as an instant, zero-dependency local Demo Mode for offline hackathon judging.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript (Strict), Tailwind CSS, React Router v6
- **Data & Forms**: TanStack Query, React Hook Form, Zod Schema Validation
- **Visualizations**: Lucide React, Recharts (Donut & Bar charts), Leaflet / React-Leaflet
- **Backend**: Supabase (PostgreSQL with RLS, Supabase Auth, 6 Supabase Edge Functions)
- **AI Layer**: AI Provider Abstraction (Gemini / OpenAI / OpenRouter) + Deterministic AI Fallback
- **Testing**: Vitest, React Testing Library, JSDOM

---

## 📁 Repository Structure

```
travelpilot/
├── src/
│   ├── components/            # UI components (ImpactRadiusGraph, PriorityBadge, StatCard, etc.)
│   ├── context/               # AuthContext & TripContext
│   ├── layouts/               # AppLayout (Header, Sidebar, Navigation)
│   ├── lib/                   # Supabase client, storage repository, mockData
│   ├── pages/                 # 14 Pages (Landing, Dashboard, Plan, Itinerary, Budget, etc.)
│   ├── schemas/               # Zod validation schemas
│   ├── services/              # Algorithmic & AI engines:
│   │   ├── travelTwin.ts      # Connected dependency graph
│   │   ├── routeOptimizer.ts  # Haversine distance, conflict detection, score
│   │   ├── budgetEngine.ts    # Deterministic budget calculation
│   │   ├── impactRadiusEngine.ts # 3-tier impact radius calculation
│   │   ├── selfHealingEngine.ts  # Full replanning & XAI explanation pipeline
│   │   ├── aiProvider.ts      # LLM provider with fallback
│   │   ├── assistantTools.ts  # Structured tool execution
│   │   └── whatIfSimulator.ts # Sandboxed scenario engine
│   ├── types/                 # TypeScript domain models
│   ├── App.tsx                # App router & routes
│   └── main.tsx               # Application entry point
├── supabase/
│   ├── migrations/            # 16 Relational tables + RLS policies
│   │   └── 20260920000001_initial_schema.sql
│   ├── functions/             # 6 Supabase Edge Functions:
│   │   ├── generate-itinerary/
│   │   ├── replan-itinerary/
│   │   ├── travel-assistant/
│   │   ├── analyze-disruption/
│   │   ├── calculate-budget/
│   │   └── risk-analysis/
│   ├── seed.sql               # Seed data for Goa Escape 4-day trip
│   └── config.toml
├── tests/
│   ├── setup.ts
│   ├── unit/                  # Unit tests (Budget, Route, Impact, Self-Healing, What-If, Tools)
│   ├── integration/           # Integration tests for React components & pages
│   └── e2e/                   # Golden scenario E2E test
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

---

