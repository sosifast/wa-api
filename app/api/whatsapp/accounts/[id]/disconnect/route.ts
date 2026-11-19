import { prisma } from "@/lib/prisma";
import { disconnectWhatsappSession } from "@/lib/whatsapp-manager";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const accountId = parseInt(params.id, 10);
    if (isNaN(accountId)) {
      return NextResponse.json(
        { success: false, error: "Invalid account ID" },
        { status: 400 }
      );
    }

    const account = await prisma.whatsappAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account not found" },
        { status: 404 }
      );
    }

    await disconnectWhatsappSession(accountId);

    return NextResponse.json({
      success: true,
      message: "Disconnected successfully",
    });
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
