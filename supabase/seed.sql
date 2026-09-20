-- TravelPilot Seed Data
-- Demo user: demo@travelpilot.app
-- Trip: Goa Escape (4 Days, ₹25,000 Budget)

-- Demo User Profile
INSERT INTO profiles (id, full_name, email, avatar_url)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Alex Morgan',
    'demo@travelpilot.app',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
) ON CONFLICT (id) DO NOTHING;

-- Demo Trip
INSERT INTO trips (id, user_id, name, destination, start_date, end_date, budget, currency, travel_style, status)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Goa Escape & Heritage Discovery',
    'Goa, India',
    '2026-10-10',
    '2026-10-13',
    25000.00,
    'INR',
    'Balanced',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Trip Preferences
INSERT INTO trip_preferences (trip_id, interest, priority) VALUES
('11111111-1111-1111-1111-111111111111', 'Beaches', 'HIGH'),
('11111111-1111-1111-1111-111111111111', 'Food', 'HIGH'),
('11111111-1111-1111-1111-111111111111', 'History', 'HIGH'),
('11111111-1111-1111-1111-111111111111', 'Adventure', 'MEDIUM'),
('11111111-1111-1111-1111-111111111111', 'Shopping', 'LOW');

-- Itinerary Days
INSERT INTO itinerary_days (id, trip_id, date, day_number) VALUES
('22222222-2222-2222-2222-222222220001', '11111111-1111-1111-1111-111111111111', '2026-10-10', 1),
('22222222-2222-2222-2222-222222220002', '11111111-1111-1111-1111-111111111111', '2026-10-11', 2),
('22222222-2222-2222-2222-222222220003', '11111111-1111-1111-1111-111111111111', '2026-10-12', 3),
('22222222-2222-2222-2222-222222220004', '11111111-1111-1111-1111-111111111111', '2026-10-13', 4);

-- Activities
-- Day 1: Arrival, Hotel Check-In, Aguada Fort & Beach Sunset
INSERT INTO activities (id, trip_id, itinerary_day_id, name, category, description, latitude, longitude, start_time, end_time, duration_minutes, estimated_cost, priority, status, opening_time, closing_time) VALUES
('33333333-3333-3333-3333-333333330101', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220001', 'Airport Transfer to Candolim', 'Transit', 'Pre-booked airport taxi from Dabolim/Mopa airport to hotel in North Goa', 15.5186, 73.7684, '10:30:00', '11:45:00', 75, 1200.00, 'HIGH', 'scheduled', '00:00:00', '23:59:00'),
('33333333-3333-3333-3333-333333330102', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220001', 'Hotel Check-in & Refresh', 'Accommodation', 'Check-in at Lemon Tree Amarante Beach Resort, Candolim', 15.5140, 73.7660, '12:00:00', '13:00:00', 60, 0.00, 'HIGH', 'scheduled', '12:00:00', '23:59:00'),
('33333333-3333-3333-3333-333333330103', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220001', 'Authentic Goan Seafood Lunch', 'Food', 'Fresh catch Goan fish thali and kingfish peri peri at Fisherman’s Cove', 15.5152, 73.7675, '13:15:00', '14:30:00', 75, 850.00, 'HIGH', 'scheduled', '11:00:00', '23:00:00'),
('33333333-3333-3333-3333-333333330104', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220001', 'Fort Aguada & Lighthouse Exploration', 'History', '17th-century Portuguese fort overlooking the Arabian Sea with panoramic ramparts', 15.4925, 73.7736, '15:30:00', '17:30:00', 120, 100.00, 'HIGH', 'scheduled', '09:30:00', '18:00:00'),
('33333333-3333-3333-3333-333333330105', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220001', 'Sinquerim Beach Sunset & Chill', 'Beaches', 'Unwind by the coastline, golden hour photography and beach drinks', 15.4988, 73.7672, '18:00:00', '20:00:00', 120, 400.00, 'HIGH', 'scheduled', '00:00:00', '23:59:00');

-- Day 2: Old Goa Heritage & Museum (Target for Disruption Demo)
INSERT INTO activities (id, trip_id, itinerary_day_id, name, category, description, latitude, longitude, start_time, end_time, duration_minutes, estimated_cost, priority, status, opening_time, closing_time) VALUES
('33333333-3333-3333-3333-333333330201', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220002', 'Archaeological Museum of Goa', 'History', 'Colonial era artifacts, portraits of Portuguese viceroys and sculpture gallery in Old Goa', 15.5028, 73.9125, '10:00:00', '12:00:00', 120, 250.00, 'HIGH', 'scheduled', '09:00:00', '17:00:00'),
('33333333-3333-3333-3333-333333330202', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220002', 'Basilica of Bom Jesus Heritage Walk', 'History', 'UNESCO World Heritage site containing sacred relics of St. Francis Xavier', 15.5009, 73.9116, '12:15:00', '13:15:00', 60, 50.00, 'HIGH', 'scheduled', '09:00:00', '18:30:00'),
('33333333-3333-3333-3333-333333330203', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220002', 'Fontainhas Latin Quarter Lunch & Walk', 'Food', 'Traditional Portuguese-Goan cuisine at Viva Panjim and colorful heritage street photography', 15.4989, 73.8322, '13:45:00', '15:30:00', 105, 950.00, 'HIGH', 'scheduled', '11:30:00', '22:30:00'),
('33333333-3333-3333-3333-333333330204', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220002', 'Miramar Beach & Mandovi River Walk', 'Beaches', 'Scenic promenade near Panaji with views of Raj Bhavan and calm waters', 15.4820, 73.8078, '16:30:00', '18:30:00', 120, 150.00, 'MEDIUM', 'scheduled', '00:00:00', '23:59:00');

-- Day 3: Coastal Watersports & Anjuna Flea Market
INSERT INTO activities (id, trip_id, itinerary_day_id, name, category, description, latitude, longitude, start_time, end_time, duration_minutes, estimated_cost, priority, status, opening_time, closing_time) VALUES
('33333333-3333-3333-3333-333333330301', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220003', 'Calangute Water Sports Package', 'Adventure', 'Parasailing, jet ski, bumper ride, and banana boat adventure', 15.5439, 73.7554, '09:30:00', '12:30:00', 180, 1800.00, 'MEDIUM', 'scheduled', '09:00:00', '17:00:00'),
('33333333-3333-3333-3333-333333330302', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220003', 'Beach Shack Lunch at Curlies', 'Food', 'Casual beach shack food overlooking Anjuna cliffs', 15.5733, 73.7408, '13:15:00', '15:00:00', 105, 1100.00, 'HIGH', 'scheduled', '10:00:00', '02:00:00'),
('33333333-3333-3333-3333-333333330303', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220003', 'Anjuna Flea & Souvenir Market', 'Shopping', 'Handcrafted jewelry, bohemian souvenirs, spices and apparel', 15.5786, 73.7431, '15:30:00', '18:00:00', 150, 600.00, 'LOW', 'scheduled', '10:00:00', '21:00:00'),
('33333333-3333-3333-3333-333333330304', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220003', 'Vagator Hilltop Sunset & Live Music', 'Nightlife', 'Iconic sunset views over Ozran beach with ambient acoustic music', 15.5992, 73.7455, '18:30:00', '21:00:00', 150, 450.00, 'MEDIUM', 'scheduled', '16:00:00', '23:30:00');

-- Day 4: Spice Plantation, Souvenirs & Departure
INSERT INTO activities (id, trip_id, itinerary_day_id, name, category, description, latitude, longitude, start_time, end_time, duration_minutes, estimated_cost, priority, status, opening_time, closing_time) VALUES
('33333333-3333-3333-3333-333333330401', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220004', 'Sahakari Spice Farm Guided Tour & Buffet', 'Culture', 'Eco-walk with organic spices, medicinal plants, traditional buffet on banana leaves', 15.4218, 74.0245, '10:00:00', '13:00:00', 180, 800.00, 'MEDIUM', 'scheduled', '09:00:00', '16:30:00'),
('33333333-3333-3333-3333-333333330402', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220004', 'Hotel Check-out & Bag Storage', 'Accommodation', 'Settle room bills and pack for airport transfer', 15.5140, 73.7660, '14:00:00', '14:30:00', 30, 0.00, 'HIGH', 'scheduled', '00:00:00', '23:59:00'),
('33333333-3333-3333-3333-333333330403', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222220004', 'Airport Drop-off Taxi', 'Transit', 'Cab transfer from Candolim to Airport for return flight', 15.5186, 73.7684, '15:30:00', '16:45:00', 75, 1200.00, 'HIGH', 'scheduled', '00:00:00', '23:59:00');

-- Activity Dependencies (Connecting Graph)
INSERT INTO activity_dependencies (activity_id, depends_on_activity_id, dependency_type) VALUES
('33333333-3333-3333-3333-333333330102', '33333333-3333-3333-3333-333333330101', 'TRANSIT_CONNECTION'),
('33333333-3333-3333-3333-333333330103', '33333333-3333-3333-3333-333333330102', 'CHECK_IN_BEFORE'),
('33333333-3333-3333-3333-333333330104', '33333333-3333-3333-3333-333333330103', 'REQUIRES_COMPLETION'),
('33333333-3333-3333-3333-333333330105', '33333333-3333-3333-3333-333333330104', 'REQUIRES_COMPLETION'),
('33333333-3333-3333-3333-333333330202', '33333333-3333-3333-3333-333333330201', 'REQUIRES_COMPLETION'),
('33333333-3333-3333-3333-333333330203', '33333333-3333-3333-3333-333333330202', 'REQUIRES_COMPLETION'),
('33333333-3333-3333-3333-333333330403', '33333333-3333-3333-3333-333333330402', 'REQUIRES_COMPLETION');

-- Bookings
INSERT INTO bookings (id, trip_id, type, provider, confirmation_number, status, start_time, end_time, cost) VALUES
('44444444-4444-4444-4444-444444440001', '11111111-1111-1111-1111-111111111111', 'Flight', 'IndiGo 6E-241', 'INDIGO-GOA-789', 'CONFIRMED', '2026-10-10 07:30:00+05:30', '2026-10-10 10:00:00+05:30', 5800.00),
('44444444-4444-4444-4444-444444440002', '11111111-1111-1111-1111-111111111111', 'Hotel', 'Lemon Tree Amarante Resort', 'LEM-GOA-994', 'CONFIRMED', '2026-10-10 12:00:00+05:30', '2026-10-13 11:00:00+05:30', 9200.00),
('44444444-4444-4444-4444-444444440003', '11111111-1111-1111-1111-111111111111', 'Activity', 'Calangute Water Adventures', 'ACT-WS-441', 'CONFIRMED', '2026-10-12 09:30:00+05:30', '2026-10-12 12:30:00+05:30', 2200.00),
('44444444-4444-4444-4444-444444440004', '11111111-1111-1111-1111-111111111111', 'Flight', 'IndiGo 6E-552', 'INDIGO-DEL-431', 'CONFIRMED', '2026-10-13 18:30:00+05:30', '2026-10-13 21:00:00+05:30', 5400.00);

-- Accommodations
INSERT INTO accommodations (trip_id, name, address, check_in, check_out, cost, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Lemon Tree Amarante Beach Resort', 'Vaddi Beach, Candolim, Goa 403515', '2026-10-10 12:00:00+05:30', '2026-10-13 11:00:00+05:30', 9200.00, 'CONFIRMED');

-- Transportation
INSERT INTO transportation (trip_id, type, origin, destination, departure_time, arrival_time, cost, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Flight', 'New Delhi (DEL)', 'Goa (GOI)', '2026-10-10 07:30:00+05:30', '2026-10-10 10:00:00+05:30', 5800.00, 'SCHEDULED'),
('11111111-1111-1111-1111-111111111111', 'Cab', 'Goa Airport', 'Lemon Tree Resort, Candolim', '2026-10-10 10:30:00+05:30', '2026-10-10 11:45:00+05:30', 1200.00, 'SCHEDULED'),
('11111111-1111-1111-1111-111111111111', 'Cab', 'Lemon Tree Resort, Candolim', 'Goa Airport', '2026-10-13 15:30:00+05:30', '2026-10-13 16:45:00+05:30', 1200.00, 'SCHEDULED'),
('11111111-1111-1111-1111-111111111111', 'Flight', 'Goa (GOI)', 'New Delhi (DEL)', '2026-10-13 18:30:00+05:30', '2026-10-13 21:00:00+05:30', 5400.00, 'SCHEDULED');

-- Expenses Logged
INSERT INTO expenses (trip_id, category, description, amount, date) VALUES
('11111111-1111-1111-1111-111111111111', 'Accommodation', 'Lemon Tree Amarante Resort (3 Nights)', 9200.00, '2026-10-10'),
('11111111-1111-1111-1111-111111111111', 'Transportation', 'Round-trip Flights (DEL-GOI)', 11200.00, '2026-10-10'),
('11111111-1111-1111-1111-111111111111', 'Local Travel', 'Airport Taxis Roundtrip', 2400.00, '2026-10-10');

-- Risk Radar Events
INSERT INTO risk_events (trip_id, type, level, probability, impact, description, recommendation, status) VALUES
('11111111-1111-1111-1111-111111111111', 'WEATHER', 'LOW', 0.25, 'Brief coastal drizzle possible on Day 3 afternoon', 'Outdoor watersports are optimal in morning hours; keep afternoon flexible.', 'MONITORING'),
('11111111-1111-1111-1111-111111111111', 'TRANSPORT', 'LOW', 0.15, 'North-South Goa bridge transit delays during peak evening rush', 'Allow 15 min buffer between Old Goa and coastal evening plans.', 'MONITORING'),
('11111111-1111-1111-1111-111111111111', 'ACTIVITY', 'MEDIUM', 0.40, 'Archaeological Museum of Goa scheduled for periodic maintenance closure', 'TravelPilot has indexed Goa State Museum & Aguada Jail Museum as instant zero-conflict backups.', 'MONITORING');
