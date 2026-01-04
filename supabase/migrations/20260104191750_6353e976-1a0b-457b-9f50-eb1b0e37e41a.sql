-- Add personnel_code column to profiles table
ALTER TABLE public.profiles ADD COLUMN personnel_code text;

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));