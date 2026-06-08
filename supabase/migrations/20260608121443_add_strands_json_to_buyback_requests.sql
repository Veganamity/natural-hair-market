ALTER TABLE hair_buyback_requests
  ADD COLUMN IF NOT EXISTS strands_json JSONB;
