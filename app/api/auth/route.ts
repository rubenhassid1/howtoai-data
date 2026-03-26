export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };

    if (!email || typeof email !== "string") {
      return Response.json({ success: false }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // Store email in GitHub Gist
    const gistId = process.env.LEADS_GIST_ID;
    const ghToken = process.env.GITHUB_TOKEN;

    if (gistId && ghToken) {
      try {
        // Fetch current gist content
        const gistRes = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: { Authorization: `token ${ghToken}` },
        });

        if (gistRes.ok) {
          const gist = await gistRes.json();
          const current = gist.files["emails.csv"]?.content || "email,timestamp";
          const updated = `${current}\n${cleanEmail},${timestamp}`;

          // Update gist
          await fetch(`https://api.github.com/gists/${gistId}`, {
            method: "PATCH",
            headers: {
              Authorization: `token ${ghToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              files: { "emails.csv": { content: updated } },
            }),
          });
        }
      } catch (e) {
        console.error("Failed to store email:", e);
      }
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
