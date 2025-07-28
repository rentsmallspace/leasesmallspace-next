-- Create properties table for property listings
CREATE TABLE IF NOT EXISTS lss_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type TEXT NOT NULL,
    size_sqft INTEGER NOT NULL,
    price_monthly DECIMAL(10, 2) NOT NULL,
    lease_type TEXT,
    available_date DATE,
    features JSONB,
    images JSONB,
    deal_score TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_lss_properties_city ON lss_properties(city);
CREATE INDEX IF NOT EXISTS idx_lss_properties_property_type ON lss_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_lss_properties_price_monthly ON lss_properties(price_monthly);
CREATE INDEX IF NOT EXISTS idx_lss_properties_size_sqft ON lss_properties(size_sqft);
CREATE INDEX IF NOT EXISTS idx_lss_properties_is_active ON lss_properties(is_active);
CREATE INDEX IF NOT EXISTS idx_lss_properties_created_at ON lss_properties(created_at);

-- Create composite index for location-based searches
CREATE INDEX IF NOT EXISTS idx_lss_properties_location ON lss_properties(city, state);

-- Create GIN index for JSONB fields
CREATE INDEX IF NOT EXISTS idx_lss_properties_features_gin ON lss_properties USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_lss_properties_images_gin ON lss_properties USING GIN (images);

-- Add updated_at trigger
CREATE TRIGGER update_lss_properties_updated_at 
    BEFORE UPDATE ON lss_properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 