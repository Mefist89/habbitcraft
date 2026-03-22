import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuestClient from "@/components/QuestClient";

export default async function QuestPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;

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
  } else {
    redirect('/hero-intro');
  }

  return <QuestClient profile={profile} />;
}
