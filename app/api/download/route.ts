import { type NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return Response.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // TODO: Check subscriber tier against Substack data
  const tier: string = "free";

  // Free gets the full archive (all 72 posts)
  // Paid gets the archive + extras (Slack, tools bundle, LinkedIn)
  const downloads: Record<string, string> = {
    "full-archive": "/howtoai-full-archive.zip",
  };

  // Paid subscribers also see links to their extras
  const extras =
    tier === "paid"
      ? [
          { name: "Private Slack community", url: "#slack-invite" },
          { name: "AI tools bundle ($219 value)", url: "#tools-bundle" },
          { name: "LinkedIn connection (760K)", url: "#linkedin" },
        ]
      : null;

  return Response.json({
    email: payload.email,
    tier,
    downloads,
    extras,
  });
}
