import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey =
  process.env.SESSION_SECRET ||
  "229124b2fdb096dc89f2853e103aad7f7abfc49684a77e1c768df1323882edc2";
const encodedKey = new TextEncoder().encode(secretKey);

export const COOKIE_NAME = "auth_session";

export interface SessionPayload {
  userId: number;
  uuid: string;
  fullName: string;
  username: string;
  email: string;
  level: "Member" | "Admin";
  status: "Active" | "In-Active";
  [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  token: string | undefined = ""
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: {
  id: number;
  uuid: string;
  full_name: string;
  username: string;
  email: string;
  level: "Member" | "Admin" | string;
  status: "Active" | "In-Active" | string;
}): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload: SessionPayload = {
    userId: user.id,
    uuid: user.uuid,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    level: user.level === "Admin" ? "Admin" : "Member",
    status: user.status === "In-Active" ? "In-Active" : "Active",
  };

  const token = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return token;
}

export async function getSession(request?: Request): Promise<SessionPayload | null> {
  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (match) {
      token = match.substring(COOKIE_NAME.length + 1);
    }
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      return null;
    }
  }

  return decrypt(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
