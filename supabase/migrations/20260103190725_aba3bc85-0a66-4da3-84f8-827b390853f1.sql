-- Add UPDATE policy for orders (admin only)
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add DELETE policy for orders (prevent all deletions for record keeping)
CREATE POLICY "No one can delete orders"
ON public.orders
FOR DELETE
USING (false);