-- Allow admins to insert products
CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));