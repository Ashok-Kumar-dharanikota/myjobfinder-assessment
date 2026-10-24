-- ==============================================================================
-- JobFinder Mobile Application - Phase 2 Database Schema Migration
-- Tables: public.profiles, public.jobs
-- Functions & Triggers:
--   1. handle_new_user() (SECURITY DEFINER with explicit search_path)
--   2. handle_profile_update() (Protects email, user ID, created_at, auto-updates updated_at)
-- Security: Row Level Security (RLS) with idempotent DROP/CREATE policies
-- Idempotency: Safe for repeated execution without duplicate errors or data corruption
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: public.profiles (1:1 link with auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policy: Authenticated users can view their own profile only
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Idempotent RLS Policy: Authenticated users can update their own profile only
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Trigger: Profile Immutability & Updated Timestamp Guard
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  -- Prevent user ID modification
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Cannot modify profile user ID';
  END IF;

  -- Prevent direct email modification (must be updated via auth.users)
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Email is managed by Supabase Auth and cannot be modified directly in profiles';
  END IF;

  -- Prevent tampering with created_at timestamp
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    NEW.created_at = OLD.created_at;
  END IF;

  -- Automatically update updated_at timestamp
  NEW.updated_at = pg_catalog.timezone('utc'::pg_catalog.text, pg_catalog.now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_update();

-- ------------------------------------------------------------------------------
-- 3. Trigger: Automated 1:1 Profile Creation on Signup (Hardened)
-- Note: Email is mirrored on signup. Subsequent email changes through Supabase
-- Auth are not currently synchronized to public.profiles.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. Table: public.jobs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  workplace_type TEXT NOT NULL DEFAULT 'Remote' CHECK (workplace_type IN ('Remote', 'Hybrid', 'On-site')),
  employment_type TEXT NOT NULL DEFAULT 'Full-time' CHECK (employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  salary_range TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  contact_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance indexes for jobs retrieval
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs (is_active);

-- Enable Row Level Security (RLS) on jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policy: Anyone (anon or authenticated) can view active jobs
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);
