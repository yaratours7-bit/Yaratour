import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, paymentLink } = await request.json();

  if (!email || !paymentLink) {
    return NextResponse.json({ error: 'Email and payment link are required' }, { status: 400 });
  }

  try {
    // In a real application, you would use an email service like Resend, SendGrid, or AWS SES.
    // For this example, we'll just log the information to the console.
    console.log(`Sending payment link to: ${email}`);
    console.log(`Payment link: ${paymentLink}`);

    // Example with Resend (if you were to implement it):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Payment Link',
      html: `<p>Click <a href="${paymentLink}">here</a> to make your payment.</p>`,
    });
    */

    return NextResponse.json({ message: 'Payment link sent successfully' });
  } catch (error) {
    console.error('Error sending payment link:', error);
    return NextResponse.json({ error: 'Failed to send payment link' }, { status: 500 });
  }
}
