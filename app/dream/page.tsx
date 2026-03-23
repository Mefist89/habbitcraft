import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DreamClient from "@/components/DreamClient";

type DreamEntry = {
  id: string;
  dream_text: string;
  mood: string;
  ai_response: string;
  created_at: string;
};

export default async function DreamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  let initialEntries: DreamEntry[] = [];

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;

    if (!profile || !profile.name || !profile.age || !profile.gender) {
      redirect('/select-hero');
    }

    const { data: dreams } = await supabase
      .from("dream_entries")
      .select("id, dream_text, mood, ai_response, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    initialEntries = (dreams as DreamEntry[] | null) ?? [];
  } else {
    redirect('/hero-intro');
  }

  return <DreamClient profile={profile} initialEntries={initialEntries} />;
}
