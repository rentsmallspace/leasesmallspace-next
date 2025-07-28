-- Update properties table for Cloudinary integration
-- Add new column for primary image (Cloudinary public ID)
ALTER TABLE lss_properties 
ADD COLUMN primary_image VARCHAR(255);

-- Update existing properties with Cloudinary public IDs
-- These should match the public IDs you upload to Cloudinary
UPDATE lss_properties 
SET primary_image = 'lakewood-warehouse' 
WHERE title LIKE '%Lakewood%' OR title LIKE '%warehouse%';

UPDATE lss_properties 
SET primary_image = 'retail-centennial_ltacwi' 
WHERE title LIKE '%Retail%' OR title LIKE '%Centennial%';

UPDATE lss_properties 
SET primary_image = 'boulder-aerial-facility' 
WHERE title LIKE '%Boulder%' OR title LIKE '%aerial%';

UPDATE lss_properties 
SET primary_image = 'brighton-flex-space' 
WHERE title LIKE '%Brighton%';

UPDATE lss_properties 
SET primary_image = 'broomfield-flex-space' 
WHERE title LIKE '%Broomfield%';

UPDATE lss_properties 
SET primary_image = 'golden-flex-space' 
WHERE title LIKE '%Golden%';

UPDATE lss_properties 
SET primary_image = 'north-denver-warehouse' 
WHERE title LIKE '%North Denver%';

UPDATE lss_properties 
SET primary_image = '11450-n-cherokee-st-northglenn' 
WHERE title LIKE '%Cherokee%' OR title LIKE '%Northglenn%';

-- Add index for better performance
CREATE INDEX idx_properties_primary_image ON lss_properties(primary_image);

-- Optional: Add a column for additional images (JSONB array of Cloudinary public IDs)
ALTER TABLE lss_properties 
ADD COLUMN additional_images JSONB DEFAULT '[]';

-- Update the existing images column to use Cloudinary public IDs
-- This keeps backward compatibility while we transition
UPDATE lss_properties 
SET images = jsonb_build_array(primary_image)
WHERE primary_image IS NOT NULL; 