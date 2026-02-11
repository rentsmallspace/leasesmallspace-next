-- Supabase Storage: create public bucket for property images
-- Run this in Supabase SQL Editor, or create the bucket in Dashboard (Storage → New bucket)

-- Bucket is typically created via Dashboard: Storage → New bucket → "property-images" → Public
-- Then upload your images to paths like: lakewood-warehouse.jpg, retail-centennial.jpg, etc.

-- Optional: RLS policies (if bucket is private, use signed URLs instead of public URL helper)
-- For public read access (simplest for listing images):
-- Storage → property-images → Policies → New policy → "Allow public read"
-- Policy name: Public read for property images
-- Allowed operation: SELECT (read)
-- Target: All users (or use "true" for bucket)

-- No table changes needed: lss_properties.primary_image and .images keep storing
-- the same identifiers (e.g. 'lakewood-warehouse'); app resolves them to
-- Supabase Storage URLs via getPropertyImage() / getStorageImageUrl().
