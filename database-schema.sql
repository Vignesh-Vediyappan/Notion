-- Simple Notion-style app database schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pages table (simplified version)
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  content text,
  parent_id uuid references pages(id),
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_user_id ON public.pages(user_id);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON public.pages(parent_id);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages
CREATE POLICY "Users can view their own pages" ON public.pages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pages" ON public.pages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages" ON public.pages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages" ON public.pages
    FOR DELETE USING (auth.uid() = user_id); 