import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      `Supabase credentials missing on Browser! URL: ${url ? 'OK' : 'MISSING'}, Key: ${key ? 'OK' : 'MISSING'}. ` +
      "Check your Vercel Environment Variables."
    );
  }

  return createBrowserClient(url, key);
}
