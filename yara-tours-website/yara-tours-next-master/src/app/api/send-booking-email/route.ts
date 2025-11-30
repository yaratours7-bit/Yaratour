import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      bookingDate,
      numberOfPeople,
      totalPrice,
      tourTitle,
    } = body;

    const user = process.env.BOOKING_EMAIL_USER;
    const pass = process.env.BOOKING_EMAIL_PASSWORD;
    const to = process.env.BOOKING_NOTIFICATION_TO || user;
    const from = process.env.BOOKING_EMAIL_FROM || user;

    if (!user || !pass || !to || !from) {
      console.error('Booking email env vars are not fully configured.');
      return NextResponse.json(
        { success: false, error: 'Booking email is not configured on the server.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const subject = `New Tour Booking: ${tourTitle || 'Unknown Tour'}`;

    const text = `New booking received.\n\n` +
      `Tour: ${tourTitle}\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Date: ${bookingDate}\n` +
      `Number of People: ${numberOfPeople}\n` +
      `Total Price: R${Number(totalPrice || 0).toFixed(2)}\n`;

    const html = `
      <h2>New Tour Booking</h2>
      <p><strong>Tour:</strong> ${tourTitle}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date:</strong> ${bookingDate}</p>
      <p><strong>Number of People:</strong> ${numberOfPeople}</p>
      <p><strong>Total Price:</strong> R${Number(totalPrice || 0).toFixed(2)}</p>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending booking email', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send booking email' },
      { status: 500 }
    );
  }
}
