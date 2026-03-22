import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - add XP when completing a task
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { xpAmount } = await request.json();
  const xpToAdd = parseInt(xpAmount) || 5;

  // Get current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single();

  const currentXP = (profile?.xp || 0) + xpToAdd;
  // Level up every 50 XP
  const newLevel = Math.floor(currentXP / 50) + 1;

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update({ xp: currentXP, level: newLevel })
    .eq('id', user.id)
    .select('xp, level')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedProfile);
}

// GET - get current XP and level
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single();

  return NextResponse.json({ xp: profile?.xp || 0, level: profile?.level || 1 });
}
