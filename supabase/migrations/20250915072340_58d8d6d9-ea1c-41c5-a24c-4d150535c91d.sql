-- Create storage buckets for KHSRNY project
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('khsrny-images', 'KHSRNY/images', true),
  ('khsrny-sounds', 'KHSRNY/Sounds', true);

-- Create RLS policies for images bucket
CREATE POLICY "Anyone can view KHSRNY images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'khsrny-images');

CREATE POLICY "Anyone can upload KHSRNY images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'khsrny-images');

CREATE POLICY "Anyone can update KHSRNY images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'khsrny-images');

CREATE POLICY "Anyone can delete KHSRNY images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'khsrny-images');

-- Create RLS policies for sounds bucket
CREATE POLICY "Anyone can view KHSRNY sounds" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'khsrny-sounds');

CREATE POLICY "Anyone can upload KHSRNY sounds" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'khsrny-sounds');

CREATE POLICY "Anyone can update KHSRNY sounds" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'khsrny-sounds');

CREATE POLICY "Anyone can delete KHSRNY sounds" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'khsrny-sounds');