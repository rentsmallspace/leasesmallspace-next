-- Add missing property detail columns to lss_properties table
-- These columns will make property details dynamic instead of hardcoded

-- Physical specifications
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS clear_height TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS loading_doors TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS power_service TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS flooring_type TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS lighting_type TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS hvac_type TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS parking_spaces INTEGER;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS outdoor_storage TEXT;

-- Location details
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS nearby_highways JSONB;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS distance_to_downtown TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS public_transit TEXT;

-- Lease details
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS lease_term TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS deposit_requirements TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS utilities_responsibility TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS maintenance_responsibility TEXT;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS insurance_requirements TEXT;

-- Amenities and features
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS amenities JSONB;
ALTER TABLE lss_properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_lss_properties_clear_height ON lss_properties(clear_height);
CREATE INDEX IF NOT EXISTS idx_lss_properties_parking_spaces ON lss_properties(parking_spaces);
CREATE INDEX IF NOT EXISTS idx_lss_properties_amenities_gin ON lss_properties USING GIN (amenities);
CREATE INDEX IF NOT EXISTS idx_lss_properties_nearby_highways_gin ON lss_properties USING GIN (nearby_highways);
CREATE INDEX IF NOT EXISTS idx_lss_properties_is_featured ON lss_properties(is_featured);
