/*
  # Force PostgREST Schema Cache Reload for saved_addresses

  This migration forces a reload of the PostgREST schema cache
  by making a minor modification to the saved_addresses table.

  ## Changes
  - Adds and removes a comment on the table to trigger cache invalidation
*/

COMMENT ON TABLE saved_addresses IS 'User saved shipping addresses for checkout';
NOTIFY pgrst, 'reload schema';