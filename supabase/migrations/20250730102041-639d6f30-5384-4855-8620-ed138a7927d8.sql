-- Enable RLS on critical tables that currently lack protection
ALTER TABLE public.hasil_undian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periode_undian ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hasil_undian table
CREATE POLICY "Authenticated users can view hasil_undian" 
ON public.hasil_undian 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert hasil_undian" 
ON public.hasil_undian 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update hasil_undian" 
ON public.hasil_undian 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete hasil_undian" 
ON public.hasil_undian 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for periode_undian table
CREATE POLICY "Authenticated users can view periode_undian" 
ON public.periode_undian 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert periode_undian" 
ON public.periode_undian 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update periode_undian" 
ON public.periode_undian 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete periode_undian" 
ON public.periode_undian 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Update database functions to use secure search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, nama, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'nama', 'User Baru'),
    'admin'::public.app_role
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;