-- Migration script to create the rewards table for the Shop feature

CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL DEFAULT 50,
    icon TEXT DEFAULT '🎁',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Allow users to fully manage only their own rewards
CREATE POLICY "Users can manage their own rewards"
    ON public.rewards
    FOR ALL
    USING (auth.uid() = user_id);
