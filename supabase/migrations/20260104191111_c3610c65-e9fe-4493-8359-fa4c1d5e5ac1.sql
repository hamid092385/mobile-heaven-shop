-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own orders or admin can view all" ON public.orders;

-- Create a new PERMISSIVE SELECT policy (default is PERMISSIVE)
CREATE POLICY "Users can view their own orders or admin can view all"
ON public.orders
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));