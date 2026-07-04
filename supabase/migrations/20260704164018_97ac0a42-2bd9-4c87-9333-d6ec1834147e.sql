GRANT INSERT ON public.products TO anon;
CREATE POLICY "Public anon can insert products"
ON public.products
FOR INSERT
TO anon
WITH CHECK (true);