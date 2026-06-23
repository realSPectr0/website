import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/ui/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const toEmail = 'linjonathan1222@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { fullName, email, message } = body;
    if (!email || !fullName || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: fromEmail!,
      to: toEmail,
      subject: 'Contact Form Submission',
      replyTo: email,
      react: await EmailTemplate({
        firstName: fullName,
        email,
        message,
      }),
    });
    return NextResponse.json({ data, message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
