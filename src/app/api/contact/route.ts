import { NextResponse } from "next/server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, telephone_number, turnstileToken } = await req.json();

    if (telephone_number) {
      // It's a bot. Don't send anything and pretend everything went well.
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message || !subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. TURNSTILE VERIFICATION
    if (!turnstileToken) {
      return NextResponse.json({ success: false, errorCode: "TURNSTILE_ERROR" }, { status: 403 });
    }

    const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const verificationRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: turnstileToken,
      }),
    });

    const verificationResult = await verificationRes.json();

    if (!verificationResult.success) {
      return NextResponse.json({ success: false, errorCode: "TURNSTILE_ERROR" }, { status: 403 });
    }

    const { data, error } = await resend.emails.send({
      from: "Liam Portfolio <portfolio@m.liamviader.com>",
      to: "contact@liamviader.com",
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Portfolio Message</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; color: #333333;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #eaeaef;">
              
              <div style="background-color: #0ea5e9; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">New Portfolio Message</h1>
              </div>

              <div style="padding: 30px;">
                <div style="margin-bottom: 25px;">
                  <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; tracking: 1px; color: #888891; margin-bottom: 8px;">Sender Details</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 4px 0; font-size: 14px;"><strong>Name:</strong> ${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0ea5e9; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</td>
                    </tr>
                  </table>
                </div>

                <div style="margin-top: 30px;">
                  <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; tracking: 1px; color: #888891; margin-bottom: 8px;">Message Content</p>
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</div>
                </div>

              </div>

              <div style="background-color: #f9fafb; padding: 20px; border-top: 1px solid #eaeaef; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                  Sent via <strong>liamviader.com</strong> automated system.
                </p>
                <p style="font-size: 11px; color: #cbd5e1; margin-top: 5px;">
                  Timestamp: ${new Date().toLocaleString('en-GB', { timeZone: 'UTC' })} UTC
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      // If Resend tells us we've exceeded the limit (Quota)
      // Reference: https://resend.com/docs/api-reference/errors
      if (error.name === "monthly_quota_exceeded" || error.name === "daily_quota_exceeded") {
        return NextResponse.json(
          { success: false, errorCode: "LIMIT_EXCEEDED" },
          { status: 429 }
        );
      }

      // Any other error from Resend (without giving technical details)
      return NextResponse.json(
        { success: false, errorCode: "GENERIC_ERROR" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error", errorCode: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}