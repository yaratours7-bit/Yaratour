import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  console.log('Incoming call webhook received');
  
  try {
    const formData = await req.formData();
    const From = formData.get('From') as string;
    const To = formData.get('To') as string;
    const CallSid = formData.get('CallSid') as string;
    
    console.log('Incoming call details:', { From, To, CallSid });
    
    const { twiml } = twilio;
    const response = new twiml.VoiceResponse();

    // Get all active users who can receive calls
    // For now, we'll route to all online users, but you can customize this logic
    const supabase = createAdminClient();
    
    // Query for active users (you might want to add an "online" status field)
    const { data: users, error } = await supabase
      .from('users')
      .select('id')
      .limit(10); // Limit to prevent too many simultaneous rings

    if (error || !users || users.length === 0) {
      console.log('No users found or error:', error);
      response.say('Sorry, no agents are available to take your call right now. Please try again later.');
      
      return new NextResponse(response.toString(), {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }

    // Create a dial verb that will ring multiple clients
    const dial = response.dial({
      callerId: From,
      timeout: 30, // Ring for 30 seconds
    });
    
    // Ring all available users simultaneously
    users.forEach((user: any) => {
      dial.client(user.id);
    });

    const twimlString = response.toString();
    console.log('Generated TwiML for incoming call:', twimlString);

    return new NextResponse(twimlString, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error handling incoming call:', error);
    const { twiml } = twilio;
    const response = new twiml.VoiceResponse();
    response.say('Sorry, there was an error processing your call.');
    
    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}
