export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gistId = process.env.LEADS_GIST_ID;
  const ghToken = process.env.GITHUB_TOKEN;

  if (!gistId || !ghToken) {
    return Response.json({ error: "Not configured" }, { status: 503 });
  }

  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${ghToken}` },
  });

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch leads" }, { status: 500 });
  }

  const gist = await res.json();
  const csv = gist.files["emails.csv"]?.content || "email,timestamp";
  const lines = csv.split("\n").filter((l: string) => l.trim());
  const total = Math.max(0, lines.length - 1); // minus header

  const format = url.searchParams.get("format");

  if (format === "csv") {
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=howtoai-leads.csv",
      },
    });
  }

  // Return JSON with stats
  const emails = lines.slice(1).map((line: string) => {
    const [email, timestamp] = line.split(",");
    return { email, timestamp };
  });

  return Response.json({
    total,
    emails,
    csv_download: `${url.origin}/api/leads?secret=${secret}&format=csv`,
  });
}
