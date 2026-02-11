-- Truncate lss_properties and re-populate with sample data using Supabase Storage image paths.
-- lss_active_properties is a VIEW (no truncate); it will show the new data automatically.
-- Inquiries referencing properties will have property_id set to NULL (ON DELETE SET NULL).

-- 1. Clear existing properties (inquiries.property_id will become NULL where they pointed here)
DELETE FROM lss_properties;

-- 2. Reset identity so new IDs are predictable (optional; remove if you prefer random UUIDs)
-- Only if your id column is SERIAL; if UUID default gen_random_uuid(), no need.
-- SELECT setval(pg_get_serial_sequence('lss_properties', 'id'), 1);  -- uncomment if id is serial

-- 3. Insert sample properties with Supabase Storage image paths (no Cloudinary suffix).
-- First 3 have is_featured = true so the hero carousel shows them.
INSERT INTO lss_properties (
    title,
    description,
    address,
    city,
    state,
    zip_code,
    property_type,
    size_sqft,
    price_monthly,
    lease_type,
    available_date,
    features,
    images,
    primary_image,
    deal_score,
    is_active,
    is_featured
) VALUES
(
    '1,200 sq ft Flex Space Units',
    'Modern flex space units with ample parking and convenient access to major highways. Perfect for small businesses looking for flexible commercial space.',
    '11450 N Cherokee St',
    'Northglenn',
    'CO',
    '80234',
    'Flex Space',
    1200,
    2850.00,
    'NNN',
    CURRENT_DATE,
    '["Ample parking", "Highway access", "Modern facilities", "Flexible layout"]',
    '["11450-n-cherokee-st-northglenn.jpg"]',
    '11450-n-cherokee-st-northglenn.jpg',
    'good',
    true,
    true
),
(
    '4,800 sq ft Flex Facility',
    'Aerial view of modern flex facility with heavy power capabilities and kitchenette. Ideal for light manufacturing or distribution operations.',
    'Boulder Industrial Park',
    'Boulder',
    'CO',
    '80301',
    'Flex Space',
    4800,
    4500.00,
    'NNN',
    CURRENT_DATE,
    '["12 ft driving door", "Heavy power", "Kitchenette", "High ceilings"]',
    '["boulder-aerial-facility.jpg"]',
    'boulder-aerial-facility.jpg',
    'great',
    true,
    true
),
(
    '1,850 sq ft Warehouse',
    'Industrial warehouse space with driving door access and heavy electrical service. Perfect for storage, light manufacturing, or distribution.',
    '1234 Industrial Blvd',
    'Lakewood',
    'CO',
    '80215',
    'Industrial Warehouse',
    1850,
    3000.00,
    'NNN',
    CURRENT_DATE,
    '["Driving door", "200 amps 3p power", "Outdoor storage", "16 ft clear height"]',
    '["lakewood-warehouse.jpg"]',
    'lakewood-warehouse.jpg',
    'excellent',
    true,
    true
),
(
    'Retail Storefront',
    'Prime retail location with street visibility and foot traffic. Perfect for retail businesses looking for high-visibility commercial space.',
    'Centennial Retail Center',
    'Centennial',
    'CO',
    '80112',
    'Retail',
    2200,
    3900.00,
    'NNN',
    CURRENT_DATE,
    '["Street visibility", "Foot traffic", "Parking", "Storefront windows"]',
    '["retail-centennial.jpg"]',
    'retail-centennial.jpg',
    'good',
    true,
    false
),
(
    'Industrial Unit',
    'Flexible industrial space with front office and warehouse area. Ideal for businesses needing both office and storage space.',
    'Brighton Industrial Park',
    'Brighton',
    'CO',
    '80601',
    'Industrial',
    1800,
    2200.00,
    'NNN',
    CURRENT_DATE,
    '["Front office", "Warehouse back", "Parking", "Loading dock"]',
    '["brighton-flex-space.jpg"]',
    'brighton-flex-space.jpg',
    'great',
    true,
    false
),
(
    'Flex Space',
    'Large flex space with ample parking and drive-in access. Perfect for businesses requiring significant space and vehicle access.',
    'Broomfield Business Park',
    'Broomfield',
    'CO',
    '80021',
    'Flex Space',
    5500,
    6500.00,
    'NNN',
    CURRENT_DATE + INTERVAL '30 days',
    '["Ample Parking", "Drive-In (2x)", "Heavy Power", "High ceilings"]',
    '["broomfield-flex-space.jpg"]',
    'broomfield-flex-space.jpg',
    'good',
    true,
    false
);

-- 4. Recreate the active properties view (drop first so column list can change)
DROP VIEW IF EXISTS lss_active_properties;
CREATE VIEW lss_active_properties AS
SELECT
    id,
    title,
    description,
    address,
    city,
    state,
    zip_code,
    property_type,
    size_sqft,
    price_monthly,
    lease_type,
    available_date,
    features,
    images,
    primary_image,
    deal_score,
    created_at
FROM lss_properties
WHERE is_active = true
ORDER BY created_at DESC;
