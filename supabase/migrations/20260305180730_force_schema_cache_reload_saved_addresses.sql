/*
  # Force PostgREST Schema Cache Reload for saved_addresses

  This migration adds a comment to the saved_addresses table to force 
  PostgREST to reload its schema cache and recognize the table.

  1. Changes
    - Adds a comment to the saved_addresses table
    - This triggers a schema change notification to PostgREST
*/

COMMENT ON TABLE saved_addresses IS 'User saved shipping addresses for checkout';

NOTIFY pgrst, 'reload schema';