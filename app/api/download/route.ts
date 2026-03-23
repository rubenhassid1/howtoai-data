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
  // For now, all verified emails get the starter pack
  // Paid subscribers would also get the full archive
  const tier: string = "free";

  const downloads: Record<string, string> =
    tier === "paid"
      ? {
          starter: "/howtoai-starter-pack.zip",
          "full-archive": "/howtoai-full-archive.zip",
        }
      : {
          starter: "/howtoai-starter-pack.zip",
        };

  return Response.json({
    email: payload.email,
    tier,
    downloads,
  });
}
