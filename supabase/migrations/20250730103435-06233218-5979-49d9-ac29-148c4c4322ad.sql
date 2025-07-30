-- Add whatsapp_config field to profiles table for secure API storage
ALTER TABLE public.profiles 
ADD COLUMN whatsapp_config TEXT;