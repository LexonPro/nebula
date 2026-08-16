-- Run this in your Supabase SQL Editor

-- 1. Create Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    "weeklyGoalDays" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    archived BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" TEXT
);

-- 2. Create Entries Table
CREATE TABLE IF NOT EXISTS public.entries (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "habitId" UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    mood INTEGER,
    UNIQUE(user_id, "habitId", date)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies so users can only read/write their own data
CREATE POLICY "Users can manage their own habits" 
ON public.habits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own entries" 
ON public.entries FOR ALL USING (auth.uid() = user_id);
