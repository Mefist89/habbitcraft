import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rewardId, cost } = await request.json();

  if (!rewardId || cost === undefined) {
    return NextResponse.json({ error: 'Missing rewardId or cost' }, { status: 400 });
  }

  // 1. Get current profile to check XP
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const currentXp = profile.xp || 0;

  if (currentXp < cost) {
    return NextResponse.json({ error: 'Not enough XP' }, { status: 400 });
  }

  // 2. Deduct XP and recalculate level
  const newXp = currentXp - cost;
  const newLevel = Math.floor(newXp / 50) + 1;

  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ xp: newXp, level: newLevel })
    .eq('id', user.id)
    .select('xp, level')
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Optionally, we could record this purchase in a 'purchases' table, but for now just returning success
  return NextResponse.json({ success: true, xp: updateData.xp, level: updateData.level });
}
