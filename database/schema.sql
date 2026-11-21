-- ==============================================================================
-- GEAR UP — PostgreSQL + PostGIS Database Schema
-- Production Schema for India-First AI-Powered Two-Wheeler Marketplace
-- ==============================================================================

-- Enable PostGIS extension for accurate geospatial calculations
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'dealer', 'inspector', 'admin');
CREATE TYPE vehicle_category AS ENUM ('motorcycle', 'scooter', 'electric');
CREATE TYPE fuel_type AS ENUM ('petrol', 'electric', 'hybrid');
CREATE TYPE seller_type AS ENUM ('individual', 'verified_dealer', 'inspection_partner');
CREATE TYPE verification_tier AS ENUM ('seller_provided', 'ai_estimated', 'document_verified', 'physically_inspected');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE media_type AS ENUM ('image_front', 'image_rear', 'image_side', 'image_cluster', 'audio_story', 'inspection_report', 'rc_document');

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role user_role DEFAULT 'buyer',
    avatar_url TEXT,
    bio TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_dealer BOOLEAN DEFAULT FALSE,
    dealer_business_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. LOCATIONS TABLE (Indian Cities & Hubs)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    neighborhood VARCHAR(150),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_locations_geom ON locations USING GIST(geom);

-- 4. VEHICLES & LISTINGS TABLE
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(100),
    category vehicle_category NOT NULL,
    manufacturing_year INT NOT NULL CHECK (manufacturing_year >= 1990 AND manufacturing_year <= 2027),
    registration_year INT NOT NULL,
    registration_state VARCHAR(10) NOT NULL, -- e.g., 'CH', 'DL', 'KA', 'MH'
    rto_code VARCHAR(20),
    km_driven INT NOT NULL CHECK (km_driven >= 0),
    fuel fuel_type DEFAULT 'petrol',
    ownership_count INT DEFAULT 1 CHECK (ownership_count >= 1),
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    original_mrp NUMERIC(12, 2),
    
    -- Location & Spatial Coordinates
    location_id UUID REFERENCES locations(id),
    address_display VARCHAR(255) NOT NULL, -- Public neighborhood/city, hides exact door number
    pickup_address TEXT,
    pickup_city VARCHAR(100),
    pickup_locality VARCHAR(100),
    pickup_landmark VARCHAR(150),
    location_visibility VARCHAR(50) DEFAULT 'approximate_public', -- 'approximate_public' or 'exact_verified_only'
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),

    -- Verification & Seller
    seller_type seller_type DEFAULT 'individual',
    verification_tier verification_tier DEFAULT 'seller_provided',
    inspection_score NUMERIC(3, 1), -- e.g., 4.8 / 5.0
    document_verified BOOLEAN DEFAULT FALSE,
    insurance_valid_until DATE,
    puc_valid_until DATE,
    has_abs BOOLEAN DEFAULT FALSE,
    battery_health_percentage INT, -- For EV models (e.g. 94%)

    -- AI Insights & Pricing Assessment
    ai_fair_price_low NUMERIC(12, 2),
    ai_fair_price_high NUMERIC(12, 2),
    ai_suggested_price NUMERIC(12, 2),
    ai_deal_badge VARCHAR(50), -- 'good_deal', 'fair_price', 'overpriced'
    ai_cosmetic_summary TEXT,
    ai_mechanical_summary TEXT,

    -- Media
    primary_image_url TEXT NOT NULL,
    gallery_image_urls TEXT[] DEFAULT '{}',
    audio_story_url TEXT,
    audio_duration_seconds INT,

    status VARCHAR(20) DEFAULT 'active', -- 'active', 'sold', 'reserved', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_geom ON listings USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_listings_brand_model ON listings(brand, model);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);

-- 5. PLACES (Rider Hubs, Inspection Centers & Scenic Pitstops)
CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    place_type VARCHAR(50) NOT NULL, -- 'inspection_hub', 'service_center', 'rider_meetup', 'ev_station'
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    rating NUMERIC(2, 1) DEFAULT 4.5,
    cover_image_url TEXT,
    is_verified_partner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_places_geom ON places USING GIST(geom);

-- 6. STORIES (User Ride Experiences, Vehicle Background & Audio Testimonials)
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    ai_summary TEXT,
    audio_url TEXT,
    audio_duration_seconds INT,
    audio_transcript TEXT,
    image_urls TEXT[] DEFAULT '{}',
    like_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MEDIA METADATA (Secure Object Storage pointers, permissions & ownership)
CREATE TABLE IF NOT EXISTS media_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    file_key VARCHAR(500) NOT NULL, -- S3 / GCS object key
    public_url TEXT NOT NULL,
    thumbnail_url TEXT,
    media_category media_type NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    width INT,
    height INT,
    is_sensitive BOOLEAN DEFAULT FALSE, -- RC docs requiring auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. RESALE UPGRADE RECORDS
CREATE TABLE IF NOT EXISTS resale_upgrades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    upgrade_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'cosmetic', 'mechanical', 'comfort', 'trust'
    estimated_cost NUMERIC(10, 2) NOT NULL,
    expected_roi_multiplier NUMERIC(3, 2) DEFAULT 1.2,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'booked', 'in_progress', 'completed'
    workshop_name VARCHAR(200),
    invoice_image_url TEXT,
    before_image_url TEXT,
    after_image_url TEXT,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 9. SAVED VEHICLES & REVIEWS
CREATE TABLE IF NOT EXISTS saved_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    booking_type VARCHAR(50) NOT NULL, -- 'test_ride', 'doorstep_inspection'
    preferred_date DATE NOT NULL,
    preferred_timeslot VARCHAR(50) NOT NULL,
    status booking_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. POSTGIS GEOSPATIAL SEARCH FUNCTION (Haversine & ST_DWithin)
-- Finds listings within target radius (meters) from given latitude/longitude
CREATE OR REPLACE FUNCTION get_nearby_listings(
    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,
    radius_km DOUBLE PRECISION
)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    category vehicle_category,
    price NUMERIC,
    km_driven INT,
    manufacturing_year INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    primary_image_url TEXT,
    verification_tier verification_tier
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        l.brand,
        l.model,
        l.category,
        l.price,
        l.km_driven,
        l.manufacturing_year,
        l.latitude,
        l.longitude,
        ROUND((ST_Distance(
            l.geom::geography, 
            ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography
        ) / 1000.0)::numeric, 2)::double precision AS distance_km,
        l.primary_image_url,
        l.verification_tier
    FROM listings l
    WHERE ST_DWithin(
        l.geom::geography,
        ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography,
        radius_km * 1000.0
    )
    AND l.status = 'active'
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- 11. POSTGIS POLYGON SEARCH FUNCTION
-- Finds listings enclosed within a custom user-drawn polygon boundary
CREATE OR REPLACE FUNCTION get_listings_in_polygon(polygon_wkt TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    category vehicle_category,
    price NUMERIC,
    km_driven INT,
    manufacturing_year INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    primary_image_url TEXT,
    verification_tier verification_tier
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        l.brand,
        l.model,
        l.category,
        l.price,
        l.km_driven,
        l.manufacturing_year,
        l.latitude,
        l.longitude,
        l.primary_image_url,
        l.verification_tier
    FROM listings l
    WHERE ST_Contains(ST_GeomFromText(polygon_wkt, 4326), l.geom)
    AND l.status = 'active';
END;
$$ LANGUAGE plpgsql;
