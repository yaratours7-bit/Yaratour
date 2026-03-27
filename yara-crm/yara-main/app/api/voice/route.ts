import { NextResponse } from 'next/server';
import twilio from 'twilio';

function isPhoneNumber(value: string): boolean {
  return /^[+0-9]/.test(value);
}

// Normalize to E.164. South African local numbers start with 0 → replace with +27
function normalizeNumber(value: string): string {
  if (value.startsWith('00')) return '+' + value.slice(2);   // 0027... → +27...
  if (value.startsWith('0'))  return '+27' + value.slice(1); // 0XX... → +27XX...
  if (!value.startsWith('+')) return '+' + value;            // missing + prefix
  return value;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rawTo = formData.get('To') as string;
    const callerId = process.env.TWILIO_PHONE_NUMBER;

    const To = isPhoneNumber(rawTo) ? normalizeNumber(rawTo) : rawTo;
    console.log('POST /api/voice - rawTo:', rawTo, '→ normalized:', To, '| callerId:', callerId);

    const { twiml } = twilio;
    const response = new twiml.VoiceResponse();

    if (To) {
      if (isPhoneNumber(rawTo)) {
        const dial = response.dial({ callerId });
        dial.number(To);
      } else {
        const dial = response.dial({ callerId });
        dial.client(To);
      }
    } else {
      response.say('No destination specified');
    }

    return new NextResponse(response.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('Error in voice route:', error);
    const { twiml } = twilio;
    const response = new twiml.VoiceResponse();
    response.say('An error occurred');
    return new NextResponse(response.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawTo = searchParams.get('To') ?? '';
  const To = isPhoneNumber(rawTo) ? normalizeNumber(rawTo) : rawTo;
  const callerId = process.env.TWILIO_PHONE_NUMBER;
  const { twiml } = twilio;
  const response = new twiml.VoiceResponse();

  if (To) {
    if (isPhoneNumber(rawTo)) {
      const dial = response.dial({ callerId });
      dial.number(To);
    } else {
      const dial = response.dial({ callerId });
      dial.client(To);
    }
  } else {
    response.say('No destination specified');
  }

  return new NextResponse(response.toString(), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
