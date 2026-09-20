-- TravelPilot Database Schema
-- Version: 1.0.0
-- Includes all 16 core entities, foreign keys, cascade constraints, indexes, triggers, and comprehensive RLS policies.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    travel_style TEXT NOT NULL DEFAULT 'Balanced', -- Relaxed, Balanced, Packed
    status TEXT NOT NULL DEFAULT 'active', -- active, completed, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trip Preferences Table
CREATE TABLE IF NOT EXISTS trip_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    interest TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'MEDIUM', -- HIGH, MEDIUM, LOW
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Itinerary Days Table
CREATE TABLE IF NOT EXISTS itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_number INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (trip_id, day_number)
);

-- 5. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    itinerary_day_id UUID REFERENCES itinerary_days(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Beaches, Adventure, Food, History, Culture, Shopping, Nature, Nightlife, Family, Photography, Transit, Accommodation
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    priority TEXT NOT NULL DEFAULT 'MEDIUM', -- HIGH, MEDIUM, LOW
    status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, directly_affected, potentially_affected, completed, cancelled, replaced
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Activity Dependencies Table
CREATE TABLE IF NOT EXISTS activity_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    depends_on_activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    dependency_type TEXT NOT NULL DEFAULT 'REQUIRES_COMPLETION', -- REQUIRES_COMPLETION, TRANSIT_CONNECTION, CHECK_IN_BEFORE
    UNIQUE (activity_id, depends_on_activity_id)
);

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- Flight, Hotel, Transport, Activity
    provider TEXT NOT NULL,
    confirmation_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED, PENDING, CANCELLED, DELAYED
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Transportation Table
CREATE TABLE IF NOT EXISTS transportation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- Flight, Train, Bus, Cab, Rental, Walking
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'SCHEDULED' -- SCHEDULED, DELAYED, CANCELLED
);

-- 9. Accommodations Table
CREATE TABLE IF NOT EXISTS accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    check_in TIMESTAMPTZ NOT NULL,
    check_out TIMESTAMPTZ NOT NULL,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'CONFIRMED' -- CONFIRMED, CANCELLED
);

-- 10. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- Accommodation, Transportation, Activities, Food, Local Travel, Other
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Disruptions Table
CREATE TABLE IF NOT EXISTS disruptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- FLIGHT_DELAY, HOTEL_CANCELLATION, VENUE_CLOSURE, WEATHER_RISK, TRANSIT_STRIKE, BUDGET_CUT
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    affected_entity_id UUID, -- References activity, booking, or transport
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED, DISMISSED
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 12. Alternatives Table
CREATE TABLE IF NOT EXISTS alternatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disruption_id UUID NOT NULL REFERENCES disruptions(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    distance NUMERIC(6, 2) NOT NULL DEFAULT 0.00, -- in km
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUGGESTED' -- SUGGESTED, ACCEPTED, REJECTED
);

-- 13. Risk Events Table
CREATE TABLE IF NOT EXISTS risk_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- WEATHER, TRANSPORT, ACTIVITY, BOOKING, SCHEDULE, BUDGET
    level TEXT NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH
    probability NUMERIC(3, 2) NOT NULL DEFAULT 0.50, -- 0.00 to 1.00
    impact TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'MONITORING', -- MONITORING, MITIGATED, TRIGGERED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Trip Changes Table (Changelog / Explainability)
CREATE TABLE IF NOT EXISTS trip_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    disruption_id UUID REFERENCES disruptions(id) ON DELETE SET NULL,
    change_type TEXT NOT NULL, -- ACTIVITY_REPLACED, SCHEDULE_SHIFTED, BUDGET_ADJUSTED, TRIP_OPTIMIZED
    before_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    after_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- user, assistant, system, tool
    content TEXT NOT NULL,
    tool_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. What-If Scenarios Table
CREATE TABLE IF NOT EXISTS what_if_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scenario_type TEXT NOT NULL, -- BUDGET_CHANGE, ADD_DAY, REMOVE_DAY, REMOVE_ACTIVITY, WEATHER_IMPACT
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'DRAFT', -- DRAFT, APPLIED, DISCARDED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Optimal Query Performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_preferences_trip_id ON trip_preferences(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(itinerary_day_id);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_disruptions_trip_id ON disruptions(trip_id);
CREATE INDEX IF NOT EXISTS idx_disruptions_status ON disruptions(status);
CREATE INDEX IF NOT EXISTS idx_risk_events_trip_id ON risk_events(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_changes_trip_id ON trip_changes(trip_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_trip_id ON chat_messages(trip_id);
CREATE INDEX IF NOT EXISTS idx_what_if_trip_id ON what_if_scenarios(trip_id);

-- ====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE disruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE what_if_scenarios ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Trips RLS
CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own trips" ON trips
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON trips
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON trips
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Trip Preferences RLS
CREATE POLICY "Users can view preferences for own trips" ON trip_preferences
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_preferences.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage preferences for own trips" ON trip_preferences
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_preferences.trip_id AND trips.user_id = auth.uid()));

-- 4. Itinerary Days RLS
CREATE POLICY "Users can view days for own trips" ON itinerary_days
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage days for own trips" ON itinerary_days
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()));

-- 5. Activities RLS
CREATE POLICY "Users can view activities for own trips" ON activities
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = activities.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage activities for own trips" ON activities
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = activities.trip_id AND trips.user_id = auth.uid()));

-- 6. Activity Dependencies RLS
CREATE POLICY "Users can view dependencies for own activities" ON activity_dependencies
    FOR SELECT USING (EXISTS (SELECT 1 FROM activities a JOIN trips t ON a.trip_id = t.id WHERE a.id = activity_dependencies.activity_id AND t.user_id = auth.uid()));
CREATE POLICY "Users can manage dependencies for own activities" ON activity_dependencies
    FOR ALL USING (EXISTS (SELECT 1 FROM activities a JOIN trips t ON a.trip_id = t.id WHERE a.id = activity_dependencies.activity_id AND t.user_id = auth.uid()));

-- 7. Bookings RLS
CREATE POLICY "Users can view bookings for own trips" ON bookings
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = bookings.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage bookings for own trips" ON bookings
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = bookings.trip_id AND trips.user_id = auth.uid()));

-- 8. Transportation RLS
CREATE POLICY "Users can view transportation for own trips" ON transportation
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = transportation.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage transportation for own trips" ON transportation
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = transportation.trip_id AND trips.user_id = auth.uid()));

-- 9. Accommodations RLS
CREATE POLICY "Users can view accommodations for own trips" ON accommodations
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = accommodations.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage accommodations for own trips" ON accommodations
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = accommodations.trip_id AND trips.user_id = auth.uid()));

-- 10. Expenses RLS
CREATE POLICY "Users can view expenses for own trips" ON expenses
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = expenses.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage expenses for own trips" ON expenses
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = expenses.trip_id AND trips.user_id = auth.uid()));

-- 11. Disruptions RLS
CREATE POLICY "Users can view disruptions for own trips" ON disruptions
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = disruptions.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage disruptions for own trips" ON disruptions
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = disruptions.trip_id AND trips.user_id = auth.uid()));

-- 12. Alternatives RLS
CREATE POLICY "Users can view alternatives for own disruptions" ON alternatives
    FOR SELECT USING (EXISTS (SELECT 1 FROM disruptions d JOIN trips t ON d.trip_id = t.id WHERE d.id = alternatives.disruption_id AND t.user_id = auth.uid()));
CREATE POLICY "Users can manage alternatives for own disruptions" ON alternatives
    FOR ALL USING (EXISTS (SELECT 1 FROM disruptions d JOIN trips t ON d.trip_id = t.id WHERE d.id = alternatives.disruption_id AND t.user_id = auth.uid()));

-- 13. Risk Events RLS
CREATE POLICY "Users can view risk events for own trips" ON risk_events
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = risk_events.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can manage risk events for own trips" ON risk_events
    FOR ALL USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = risk_events.trip_id AND trips.user_id = auth.uid()));

-- 14. Trip Changes RLS
CREATE POLICY "Users can view change history for own trips" ON trip_changes
    FOR SELECT USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_changes.trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "Users can insert change history for own trips" ON trip_changes
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_changes.trip_id AND trips.user_id = auth.uid()));

-- 15. Chat Messages RLS
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 16. What-If Scenarios RLS
CREATE POLICY "Users can view own what-if scenarios" ON what_if_scenarios
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own what-if scenarios" ON what_if_scenarios
    FOR ALL USING (auth.uid() = user_id);
