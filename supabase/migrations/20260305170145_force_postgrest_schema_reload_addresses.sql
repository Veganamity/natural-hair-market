/*
  # Force PostgREST Schema Reload for saved_addresses
  
  1. Problem
    - PostgREST schema cache still not recognizing saved_addresses table
    - Previous NOTIFY pgrst commands were not effective
    
  2. Solution
    - Grant explicit permissions to anon and authenticated roles
    - Add a dummy column and remove it to force schema change detection
    - Execute multiple reload signals
    - Update table statistics
    
  3. Security
    - Maintain existing RLS policies
    - Ensure proper role permissions
*/

-- Ensure the anon and authenticated roles have proper grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.saved_addresses TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Force PostgREST to detect a schema change by adding and removing a dummy column
ALTER TABLE saved_addresses ADD COLUMN IF NOT EXISTS _cache_buster boolean DEFAULT false;
ALTER TABLE saved_addresses DROP COLUMN IF EXISTS _cache_buster;

-- Update table statistics
ANALYZE saved_addresses;

-- Send multiple reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

-- Additional cache invalidation
SELECT pg_notify('pgrst', 'reload schema');
