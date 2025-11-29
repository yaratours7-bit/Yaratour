import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const { email, password, role, firstName, lastName, phone } =
    await request.json();

  if (!email || !password || !role || !firstName || !lastName || !phone) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      role,
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }
  }

  return NextResponse.json(authData);
}
