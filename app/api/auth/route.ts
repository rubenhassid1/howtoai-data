import { generateToken } from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const token = generateToken(email.toLowerCase().trim());
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/download?token=${token}`;

    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "How to AI Data <data@howtoai.com>",
          to: [email.toLowerCase().trim()],
          subject: "Your How to AI data download link",
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background-color:#111111;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
          <tr>
            <td style="padding:40px 32px;text-align:center;">
              <div style="width:48px;height:48px;background-color:#FF6719;border-radius:10px;display:inline-block;line-height:48px;color:white;font-size:20px;font-weight:bold;margin-bottom:24px;">AI</div>
              <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;">Your download is ready</h1>
              <p style="color:#999999;font-size:15px;line-height:1.6;margin:0 0 28px 0;">
                Click the button below to access your How to AI data download. This link expires in 24 hours.
              </p>
              <a href="${magicLink}" style="display:inline-block;background-color:#FF6719;color:#000000;font-weight:600;font-size:15px;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Download Data
              </a>
              <p style="color:#555555;font-size:12px;margin:28px 0 0 0;">
                If you didn&rsquo;t request this, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Resend API error:", error);
        return Response.json(
          { success: false, message: "Failed to send email. Please try again." },
          { status: 500 }
        );
      }
    } else {
      console.log("\n========================================");
      console.log("MAGIC LINK (dev mode):");
      console.log(magicLink);
      console.log("========================================\n");
    }

    return Response.json({
      success: true,
      message: "Check your email for the download link",
    });
  } catch {
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
