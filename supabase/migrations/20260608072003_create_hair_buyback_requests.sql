
-- Table des demandes de rachat de cheveux
CREATE TABLE IF NOT EXISTS hair_buyback_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  salon_name TEXT,
  photo_url TEXT,
  hair_condition TEXT NOT NULL CHECK (hair_condition IN ('natural', 'colored')),
  hair_color TEXT CHECK (hair_color IN ('chestnut', 'blond_roux_gris')),
  hair_length TEXT NOT NULL,
  calculated_price TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused'))
);

ALTER TABLE hair_buyback_requests ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut soumettre une demande (formulaire public)
CREATE POLICY "public_insert_buyback" ON hair_buyback_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Seul l'admin peut consulter les demandes
CREATE POLICY "admin_select_buyback" ON hair_buyback_requests
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'stephaniebuisson1115@gmail.com');

-- Seul l'admin peut modifier le statut
CREATE POLICY "admin_update_buyback" ON hair_buyback_requests
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'stephaniebuisson1115@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'stephaniebuisson1115@gmail.com');

-- Bucket pour les photos de rachat
INSERT INTO storage.buckets (id, name, public)
VALUES ('buyback-photos', 'buyback-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Politique de stockage : upload public (formulaire sans connexion)
CREATE POLICY "public_upload_buyback_photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'buyback-photos');

-- Lecture publique des photos
CREATE POLICY "public_read_buyback_photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'buyback-photos');
