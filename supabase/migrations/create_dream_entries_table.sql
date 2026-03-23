CREATE TABLE IF NOT EXISTS public.dream_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dream_text TEXT NOT NULL,
    mood TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    lang TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.dream_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dream entries"
    ON public.dream_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dream entries"
    ON public.dream_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dream entries"
    ON public.dream_entries
    FOR DELETE
    USING (auth.uid() = user_id);
