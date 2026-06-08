-- Allow authenticated users to SELECT their own buyback requests matched by email
CREATE POLICY "seller_select_own_buyback" ON hair_buyback_requests
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = email);
