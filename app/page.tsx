import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export default async function Home() {
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

    // Strict redirect: if they are logged in but didn't finish profile
    if (!profile || !profile.name || !profile.age || !profile.gender) {
      redirect('/select-hero');
    }
  } else {
    redirect('/home');
  }

  return <DashboardClient profile={profile} />;
}
