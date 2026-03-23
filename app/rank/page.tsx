import RankClient from "@/components/RankClient";
import { createClient } from "@/lib/supabase/server";

type LeaderboardEntry = {
  id: string;
  name: string | null;
  xp: number | null;
  level: number | null;
  selected_hero: string | null;
};

export default async function RankPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, xp, level, selected_hero")
    .not("name", "is", null)
    .order("level", { ascending: false })
    .order("xp", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to load leaderboard:", error.message);
  }

  return (
    <RankClient
      leaderboard={(data as LeaderboardEntry[] | null) ?? []}
      currentUserId={user?.id ?? null}
    />
  );
}
