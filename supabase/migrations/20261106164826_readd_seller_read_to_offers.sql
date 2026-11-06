-- Re-add seller_read column that was missing from the live database
ALTER TABLE offers ADD COLUMN IF NOT EXISTS seller_read boolean DEFAULT false NOT NULL;