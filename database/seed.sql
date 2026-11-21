-- ==============================================================================
-- GEAR UP — Comprehensive Seed Data for PostgreSQL + PostGIS
-- Seed for 35+ Two-Wheelers Across Indian Hubs
-- ==============================================================================

-- 1. Insert Initial System Users
INSERT INTO users (id, email, phone, full_name, role, is_phone_verified, is_dealer, dealer_business_name)
VALUES
('00000000-0000-0000-0000-000000000001', 'gurpreet.singh@gearup.in', '+919876543210', 'Gurpreet Singh', 'seller', true, false, NULL),
('00000000-0000-0000-0000-000000000002', 'priya.sharma@gearup.in', '+919812345678', 'Priya Sharma', 'seller', true, false, NULL),
('00000000-0000-0000-0000-000000000003', 'dealer.apex@gearup.in', '+919988776655', 'Apex EV Studio Mohali', 'dealer', true, true, 'Apex Electric Two-Wheelers Pvt Ltd'),
('00000000-0000-0000-0000-000000000004', 'admin@gearup.in', '+919999999999', 'GEAR UP SuperAdmin', 'admin', true, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Certified Partner Places & Inspection Hubs
INSERT INTO places (id, name, place_type, city, address, latitude, longitude, geom, rating, cover_image_url, is_verified_partner)
VALUES
('10000000-0000-0000-0000-000000000001', 'GEAR UP Inspection Hub — Sector 17', 'inspection_hub', 'Chandigarh', 'SCO 88-89, Sector 17-C, Chandigarh', 30.7385, 76.7825, ST_SetSRID(ST_MakePoint(76.7825, 30.7385), 4326), 4.9, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', true),
('10000000-0000-0000-0000-000000000002', 'Tri-City MotoPartner & Detailing Lounge', 'service_center', 'Mohali', 'Plot 412, Industrial Area Phase 9, Mohali', 30.6845, 76.7325, ST_SetSRID(ST_MakePoint(76.7325, 30.6845), 4326), 4.8, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', true),
('10000000-0000-0000-0000-000000000003', 'Delhi Rider Junction & Test Track', 'rider_meetup', 'Delhi', 'Near India Gate Outer Circle, New Delhi', 28.6129, 77.2295, ST_SetSRID(ST_MakePoint(77.2295, 28.6129), 4326), 4.9, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', true),
('10000000-0000-0000-0000-000000000004', 'Bengaluru EV Fast Supercharging & Hub', 'ev_station', 'Bengaluru', '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru', 12.9725, 77.6398, ST_SetSRID(ST_MakePoint(77.6398, 12.9725), 4326), 4.7, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Vehicle Listings with Spatial Coordinates
INSERT INTO listings (
    id, user_id, title, brand, model, variant, category, manufacturing_year, registration_year, 
    registration_state, rto_code, km_driven, fuel, ownership_count, price, original_mrp,
    address_display, latitude, longitude, geom, seller_type, verification_tier, inspection_score,
    document_verified, primary_image_url, ai_fair_price_low, ai_fair_price_high, ai_suggested_price,
    ai_deal_badge, ai_cosmetic_summary, ai_mechanical_summary
)
VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '2023 Royal Enfield Classic 350 Dual Channel ABS',
    'Royal Enfield', 'Classic 350', 'Halcyon Green', 'motorcycle', 2023, 2023,
    'CH', 'CH-01-BK', 6800, 'petrol', 1, 185000, 224000,
    'Sector 35-B, Chandigarh', 30.7258, 76.7688, ST_SetSRID(ST_MakePoint(76.7688, 30.7258), 4326),
    'individual', 'physically_inspected', 4.9, true,
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    178000, 192000, 184500, 'fair_price',
    'Original Halcyon Green finish in showroom condition with spotless chrome',
    'J-series counterbalanced engine in prime tune, Bybre brake pads at 85% life'
),
(
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    '2022 Honda Activa 6G Deluxe',
    'Honda', 'Activa 6G', 'Deluxe LED', 'scooter', 2022, 2022,
    'CH', 'CH-01-AY', 14200, 'petrol', 1, 58000, 86000,
    'Sector 22 Market, Chandigarh', 30.7398, 76.7725, ST_SetSRID(ST_MakePoint(76.7725, 30.7398), 4326),
    'individual', 'document_verified', 4.6, true,
    'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1000&q=80',
    54000, 61000, 57500, 'good_deal',
    'Clean Pearl Siren Blue body paint with minor lower scuff',
    'Silent start ACG motor functional, combi-brake system responsive'
),
(
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    '2023 Ather 450X Gen 3 (3.7 kWh Pro Pack)',
    'Ather', '450X Gen 3', 'Space Grey Pro', 'electric', 2023, 2023,
    'PB', 'PB-65-AX', 9200, 'electric', 1, 112000, 165000,
    'Phase 7 Industrial Area, Mohali', 30.7088, 76.7112, ST_SetSRID(ST_MakePoint(76.7112, 30.7088), 4326),
    'verified_dealer', 'physically_inspected', 4.8, true,
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
    108000, 119000, 113000, 'fair_price',
    'Crisp touchscreen display, alloy wheels free of curb rash',
    'Battery state of health verified at 96%, Warp mode acceleration calibrated'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Verified Rider Audio Stories
INSERT INTO stories (id, user_id, listing_id, place_id, title, content, ai_summary, audio_url, audio_duration_seconds, audio_transcript)
VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Weekend rides to Kasauli & Leh Highway prep',
    'Bought this Classic 350 for relaxed weekend highway cruising. Kept in covered parking in Sector 35. Timely serviced at Authorized Royal Enfield Workshop. Upgrading to Himalayan 450.',
    'Carefully maintained J-Series Classic 350 with full authorized workshop service logs.',
    'https://actions.google.com/sounds/v1/transportation/motorcycle_drive_by.ogg',
    42,
    'I bought this Classic 350 for relaxed weekend highway cruising. Kept it in covered parking in Sector 35. Timely serviced at Authorized Royal Enfield Workshop. Upgrading to Himalayan 450.'
)
ON CONFLICT (id) DO NOTHING;
