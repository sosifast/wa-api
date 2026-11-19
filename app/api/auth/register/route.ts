import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, username, email, password } = body;

    if (!full_name || !username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: trimmedEmail }, { username: trimmedUsername }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingUser.email.toLowerCase() === trimmedEmail
              ? "Email sudah digunakan"
              : "Username sudah digunakan",
        },
        { status: 400 }
      );
    }

    // Always create new public registrations strictly with level "Member"
    const user = await prisma.user.create({
      data: {
        full_name: full_name.trim(),
        username: trimmedUsername,
        email: trimmedEmail,
        password, // Note: In production use bcrypt / argon2 hash
        level: "Member",
        status: "Active",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil!",
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
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
