export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || typeof email !== "string") {
      return Response.json({ success: false }, { status: 400 });
    }

    // Log for lead capture
    console.log(`[lead] ${new Date().toISOString()} — ${email.toLowerCase().trim()}`);

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
