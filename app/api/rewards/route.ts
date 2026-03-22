import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - fetch all rewards for the current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: rewards, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(rewards);
}

// POST - create a new reward
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, cost, icon } = await request.json();

  if (!title || cost === undefined) {
    return NextResponse.json({ error: 'Title and cost are required' }, { status: 400 });
  }

  const { data: reward, error } = await supabase
    .from('rewards')
    .insert({
      user_id: user.id,
      title,
      description: description || '',
      cost: parseInt(cost, 10),
      icon: icon || '🎁',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(reward);
}

// DELETE - remove a reward
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  const { error } = await supabase
    .from('rewards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
