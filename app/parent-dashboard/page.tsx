import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ParentDashboardClient from "@/components/ParentDashboardClient";

export default async function ParentDashboardPage() {
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
  } else {
    redirect('/hero-intro');
  }

  return <ParentDashboardClient profile={profile} />;
}
