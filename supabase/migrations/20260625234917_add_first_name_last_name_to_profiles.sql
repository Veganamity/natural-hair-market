-- Add separate first_name and last_name columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name text;

-- Populate from existing full_name (split on first space)
UPDATE profiles
SET
  first_name = COALESCE(
    NULLIF(split_part(COALESCE(full_name, ''), ' ', 1), ''),
    NULL
  ),
  last_name = COALESCE(
    NULLIF(
      CASE
        WHEN position(' ' in COALESCE(full_name, '')) > 0
        THEN trim(substring(COALESCE(full_name, '') from position(' ' in COALESCE(full_name, '')) + 1))
        ELSE ''
      END,
      ''
    ),
    NULL
  )
WHERE full_name IS NOT NULL AND full_name != '';

NOTIFY pgrst, 'reload schema';
