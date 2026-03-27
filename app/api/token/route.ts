import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET() {
  console.log('Token request received');
  
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('User from Supabase:', user ? 'Found' : 'Not found');

    if (!user) {
      console.log('No user found, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      TWILIO_APP_SID,
    } = process.env;

    console.log('Environment variables check:', {
      TWILIO_ACCOUNT_SID: !!TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY: !!TWILIO_API_KEY,
      TWILIO_API_SECRET: !!TWILIO_API_SECRET,
      TWILIO_APP_SID: !!TWILIO_APP_SID,
    });

    if (
      !TWILIO_ACCOUNT_SID ||
      !TWILIO_API_KEY ||
      !TWILIO_API_SECRET ||
      !TWILIO_APP_SID
    ) {
      console.log('Missing Twilio environment variables');
      return NextResponse.json(
        { error: 'Twilio environment variables not set' },
        { status: 500 }
      );
    }

    console.log('Creating access token for user:', user.id);

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: TWILIO_APP_SID,
      incomingAllow: true,
    });

    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      { identity: user.id }
    );

    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    console.log('Token generated successfully, length:', jwt.length);

    return NextResponse.json({ token: jwt });
  } catch (error) {
    console.error('Error in token generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
