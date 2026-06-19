import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, hashPassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const envUsername = process.env.ADMIN_USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envUsername || !envPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (username !== envUsername) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const storedHash = envPassword.startsWith("$2a$") || envPassword.startsWith("$2b$") || envPassword.startsWith("$2y$")
      ? envPassword
      : await hashPassword(envPassword);

    const valid = envPassword.startsWith("$2a$") || envPassword.startsWith("$2b$") || envPassword.startsWith("$2y$")
      ? await verifyPassword(password, storedHash)
      : password === envPassword;

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken(username);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
