import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/ui/email-template';
import { formSchema } from '@/lib/zodSchemas';

const fallbackToEmail = 'linjonathan1222@gmail.com';
const fallbackFromEmail = 'Portfolio Contact <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || fallbackFromEmail;
    const toEmail = process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_TO_EMAIL || fallbackToEmail;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const parsedBody = formSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const { fullName, email, message } = parsedBody.data;

    const data = await resend.emails.send({
      from: fromEmail,
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
    const message = error instanceof Error ? error.message : 'Failed to send email';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
