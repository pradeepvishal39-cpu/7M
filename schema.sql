-- ==========================================
-- 7 MUSCLE FITNESS - DATABASE RESET SCRIPT
-- WARNING: This will drop your existing bookings and memberships!
-- Copy & Paste this entire file into the Supabase SQL Editor
-- ==========================================

-- 1. CLEAN SLATE: Nuke the old legacy tables and all their ghost constraints
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.memberships CASCADE;

-- 2. Create 'users' table (safely patching if needed safely)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create PERFECT 'bookings' table
-- Notice there are NO legacy `date`, `time`, or `type` constraints here!
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  goal TEXT,
  time_slot TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  user_id UUID REFERENCES public.users(id), -- Nullable allowing guest bookings!
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create PERFECT 'memberships' table
CREATE TABLE public.memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  plan TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending' NOT NULL,
  payment_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS tracking
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Authenticated users can view users" ON public.users;
CREATE POLICY "Authenticated users can view users" 
ON public.users FOR SELECT TO authenticated USING (true);


-- BOOKINGS POLICIES
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
CREATE POLICY "Anyone can insert bookings" 
ON public.bookings FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view bookings" ON public.bookings;
CREATE POLICY "Authenticated can view bookings" 
ON public.bookings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated can update bookings" ON public.bookings;
CREATE POLICY "Authenticated can update bookings" 
ON public.bookings FOR UPDATE TO authenticated USING (true);


-- MEMBERSHIPS POLICIES
DROP POLICY IF EXISTS "Users can insert their own memberships" ON public.memberships;
CREATE POLICY "Users can insert their own memberships" 
ON public.memberships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated can view memberships" ON public.memberships;
CREATE POLICY "Authenticated can view memberships" 
ON public.memberships FOR SELECT TO authenticated USING (true);

-- ==========================================
-- FORCE API CACHE REFRESH
-- ==========================================
NOTIFY pgrst, 'reload schema';
