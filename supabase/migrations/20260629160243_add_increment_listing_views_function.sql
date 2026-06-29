CREATE OR REPLACE FUNCTION increment_listing_views(listing_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE listings
  SET views_count = views_count + 1
  WHERE id = listing_id;
$$;

GRANT EXECUTE ON FUNCTION increment_listing_views(uuid) TO anon, authenticated;
