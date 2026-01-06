-- Add tracking_code column to orders table
ALTER TABLE public.orders ADD COLUMN tracking_code TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_orders_tracking_code ON public.orders(tracking_code);
CREATE INDEX idx_orders_phone ON public.orders(phone);