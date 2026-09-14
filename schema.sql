CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    parent_id UUID,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

    CONSTRAINT categories_parent_id_fkey
        FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT
);


-- ============================================================
-- STORES
-- ============================================================

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL UNIQUE,

    name TEXT NOT NULL,

    slug VARCHAR(150) NOT NULL UNIQUE,

    logo_url TEXT,

    cover_url TEXT,

    verified BOOLEAN NOT NULL DEFAULT FALSE,

    rating DECIMAL(3,2) NOT NULL DEFAULT 0,

    reviews_count INTEGER NOT NULL DEFAULT 0,

    products_count INTEGER NOT NULL DEFAULT 0,

    location TEXT,

    followers_count INTEGER NOT NULL DEFAULT 0,

    description TEXT,

    phone VARCHAR(30),

    email VARCHAR(255),

    website TEXT,

    vacation_mode BOOLEAN NOT NULL DEFAULT FALSE,

    business_hours JSONB NOT NULL DEFAULT '{}',

    social_links JSONB NOT NULL DEFAULT '{}',

    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STORE POLICIES
-- ============================================================

CREATE TABLE store_policies (
    store_id UUID PRIMARY KEY,

    return_policy TEXT NOT NULL,

    refund_policy TEXT NOT NULL,

    cancellation_policy TEXT NOT NULL,

    privacy_policy TEXT NOT NULL,

    updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),

    CONSTRAINT store_policies_store_id_fkey
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_categories_parent
    ON categories (parent_id);

CREATE INDEX idx_categories_active
    ON categories (is_active);


CREATE INDEX idx_stores_verified_location
    ON stores (verified, location);