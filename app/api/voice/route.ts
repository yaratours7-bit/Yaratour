import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: Request) {
  console.log('POST request received at /api/voice');
  
  try {
    const formData = await req.formData();
    const To = formData.get('To') as string;
    const From = formData.get('From') as string;
    
    console.log('POST - To parameter:', To);
    console.log('POST - From parameter:', From);
    console.log('POST - All form data:', Object.fromEntries(formData.entries()));
    
    const callerId = process.env.TWILIO_PHONE_NUMBER;
    console.log('POST - Caller ID:', callerId);
    
    const { twiml } = twilio;
    const response = new twiml.VoiceResponse();

    if (To) {
      // Check if To is a phone number (starts with +) or a client identifier
      if (To.startsWith('+')) {
        console.log('POST - Dialing phone number:', To);
        // It's a phone number
        const dial = response.dial({
          callerId,
        });
        dial.number(To);
      } else {
        console.log('POST - Dialing client:', To);
        // It's a client identifier
        const dial = response.dial({
          callerId,
        });
        dial.client(To);
      }
    } else {
      console.log('POST - No destination specified');
      response.say('No destination specified');
    }

    const twimlString = response.toString();
    console.log('POST - Generated TwiML:', twimlString);

    return new NextResponse(twimlString, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('POST - Error in voice route:', error);
    const { twiml } = twilio;
    const response = new twiml.VoiceResponse();
    response.say('An error occurred');
    return new NextResponse(response.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// Also support GET for testing
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const To = searchParams.get('To');
  console.log('To parameter:', To);
  const callerId = process.env.TWILIO_PHONE_NUMBER;
  console.log('Caller ID:', callerId);
  const { twiml } = twilio;
  const response = new twiml.VoiceResponse();

  if (To) {
    // Check if To is a phone number (starts with +) or a client identifier
    if (To.startsWith('+')) {
      // It's a phone number
      const dial = response.dial({
        callerId,
      });
      dial.number(To);
    } else {
      // It's a client identifier
      const dial = response.dial({
        callerId,
      });
      dial.client(To);
    }
  } else {
    response.say('No destination specified');
  }

  return new NextResponse(response.toString(), {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
