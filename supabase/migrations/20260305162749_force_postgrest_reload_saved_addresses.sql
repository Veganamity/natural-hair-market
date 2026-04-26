/*
  # Force PostgREST schema cache reload for saved_addresses
  
  1. Changes
    - Add and immediately remove a temporary column to force PostgREST to reload the table schema
    - This is a workaround for PostgREST cache issues
*/

-- Add a temporary column
ALTER TABLE saved_addresses ADD COLUMN IF NOT EXISTS temp_reload_column text;

-- Immediately remove it
ALTER TABLE saved_addresses DROP COLUMN IF EXISTS temp_reload_column;

-- Send reload notification
NOTIFY pgrst, 'reload schema';
