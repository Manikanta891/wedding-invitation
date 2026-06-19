import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import crypto from "crypto";

const SECRET = process.env.ADMIN_SECRET || "fallback-secret";
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(username: string): string {
  const payload = JSON.stringify({ username, exp: Date.now() + 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + signature;
}

export function verifyToken(token: string): { username: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;
  const rawPayload = Buffer.from(encodedPayload, "base64").toString("utf-8");
  const expectedSig = crypto.createHmac("sha256", SECRET).update(rawPayload).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf-8"));
    if (payload.exp < Date.now()) return null;
    return { username: payload.username };
  } catch {
    return null;
  }
}

export function getAuthUser(request: NextRequest): { username: string } | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.slice(7));
}
