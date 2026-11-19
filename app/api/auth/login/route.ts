import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, error: "Username/Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Username/Email atau password salah" },
        { status: 401 }
      );
    }

    if (user.status !== "Active") {
      return NextResponse.json(
        { success: false, error: "Akun Anda berstatus In-Active. Hubungi admin." },
        { status: 403 }
      );
    }

    // Set HTTP-only session cookie
    await createSession(user);

    const redirectUrl = user.level === "Admin" ? "/admin" : "/member";

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      redirectUrl,
      user: {
        id: user.id,
        uuid: user.uuid,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        level: user.level,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}
