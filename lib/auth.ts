import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "dev-secret-do-not-use-in-production";

interface TokenPayload {
  email: string;
  timestamp: number;
  expires: number;
}

export function generateToken(email: string): string {
  const payload: TokenPayload = {
    email,
    timestamp: Date.now(),
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [data, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(data)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload: TokenPayload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.expires) return null;

    return payload;
  } catch {
    return null;
  }
}
