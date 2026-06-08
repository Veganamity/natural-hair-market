ALTER TABLE hair_buyback_requests
  ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
  ADD COLUMN IF NOT EXISTS shipping_tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS sendcloud_parcel_id TEXT,
  ADD COLUMN IF NOT EXISTS label_generated_at TIMESTAMPTZ;
