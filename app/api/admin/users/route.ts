import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session || session.level !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { create_at: "desc" },
      select: {
        id: true,
        uuid: true,
        full_name: true,
        username: true,
        email: true,
        level: true,
        status: true,
        create_at: true,
        update_at: true,
        _count: {
          select: {
            whatsapp_accounts: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    if ((error as { digest?: string })?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    console.error("Admin fetch users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
