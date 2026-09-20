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

## 🚀 Quick Start (Local Run)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Account & Golden Scenario

- **Demo User**: `demo@travelpilot.app`
- **Default Trip**: Goa Escape & Heritage Discovery (4 Days, ₹25,000 Budget)
- **Golden Disruption Demo**:
  1. Go to **Disruption Center** (or click the top banner button).
  2. Click **"Simulate Museum Closure"**.
  3. Observe the **Impact Radius Assessment** (Directly Affected: Archaeological Museum 🔴, Potentially Affected: 🟡, Unaffected: 🟢).
  4. View the **Autonomous Self-Healing** result: **Goa State Museum** is selected as the top candidate (96% fit, 2.1 km away, ₹100 cost, saving ₹150 while preserving High History priority).
  5. Check the updated **Itinerary**, **Budget**, and **Explainable AI** popup.

---

## 🌐 Deploying Without Supabase (Standalone / Static SPA)

TravelPilot has a **Local-First & Client-Side Engine Architecture**. All optimization engines, self-healing algorithms, deterministic AI generators, budget arithmetic, and state persistence (`localStorage`) work **100% in the browser with ZERO external database or Supabase requirement**.

### Zero Environment Variables Required
When deployed without Supabase environment variables (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`), TravelPilot automatically runs in self-contained mode:
- **Auth**: Instant 1-click demo login (`demo@travelpilot.app`) + custom user accounts stored in browser storage.
- **Data Persistence**: Offline-first storage repository saves trips, itineraries, what-if scenarios, and logs.
- **AI & Self-Healing**: Built-in deterministic trip generator + full optimization graph run client-side. (Optional: supply `AI_API_KEY` for live Gemini API).

---

### Option 1: Vercel (1-Click / Recommended)
`vercel.json` is already included for SPA routing.

1. Install Vercel CLI or import repository on [vercel.com](https://vercel.com):
   ```bash
   npx vercel
   ```
2. **Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: *(None required)*

---

### Option 2: Netlify
`netlify.toml` and `public/_redirects` are already configured.

1. Link your repository on [netlify.com](https://netlify.com) or run:
   ```bash
   npx netlify deploy --prod
   ```
2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

---

### Option 3: GitHub Pages
1. In `vite.config.ts`, if using a subpath (e.g. `https://<user>.github.io/<repo>/`), set `base: './'`.
2. Build and publish `dist` or use GitHub Actions workflow.

---

### Option 4: Docker / Any Cloud Server (Nginx)
`Dockerfile` and `nginx.conf` are pre-configured:
```bash
# Build docker image
docker build -t travelpilot .

# Run container on port 80
docker run -p 80:80 travelpilot
```

---

## 🔒 Optional: Supabase & Database Architecture

When connected to Supabase, TravelPilot unlocks cloud multi-device sync, Supabase Auth, and Edge Functions.

### Relational Tables (16 Entities):
- `profiles`, `trips`, `trip_preferences`, `itinerary_days`, `activities`, `activity_dependencies`, `bookings`, `transportation`, `accommodations`, `expenses`, `disruptions`, `alternatives`, `risk_events`, `trip_changes`, `chat_messages`, `what_if_scenarios`.

### Row Level Security (RLS):
Every table is locked down with strict RLS policies ensuring users can only read, insert, update, and delete their own trip records.

