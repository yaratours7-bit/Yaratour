import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { lead_id, name, url, user_id } = await request.json();
  const supabase = createAdminClient();

  if (!lead_id || !name || !url || !user_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('documents')
    .insert([{ lead_id, name, url, user_id }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also update the lead's last_updated timestamp
  const { error: leadError } = await supabase
    .from('leads')
    .update({ last_updated: new Date().toISOString() })
    .eq('id', lead_id);

  if (leadError) {
    // Log the error, but don't block the response to the client
    console.error('Error updating lead:', leadError);
  }

  return NextResponse.json(data);
}
