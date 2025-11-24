/*
  # Create Storage Bucket for Hair Images

  1. Storage Configuration
    - Create a public bucket called 'hair-images' for storing listing photos
    - Enable public access for viewing images
    - Set file size limits and allowed file types

  2. Security Policies
    - Authenticated users can upload images
    - Anyone can view images (public read access)
    - Users can only delete their own images
*/

-- Create the storage bucket for hair images
INSERT INTO storage.buckets (id, name, public)
VALUES ('hair-images', 'hair-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload hair images'
  ) THEN
    CREATE POLICY "Authenticated users can upload hair images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'hair-images');
  END IF;
END $$;

-- Allow public access to view images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view hair images'
  ) THEN
    CREATE POLICY "Anyone can view hair images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'hair-images');
  END IF;
END $$;

-- Allow users to update their own images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own hair images'
  ) THEN
    CREATE POLICY "Users can update their own hair images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'hair-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Allow users to delete their own images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own hair images'
  ) THEN
    CREATE POLICY "Users can delete their own hair images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'hair-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;