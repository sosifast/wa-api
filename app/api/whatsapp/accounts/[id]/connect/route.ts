import { prisma } from "@/lib/prisma";
import { startWhatsappSession } from "@/lib/whatsapp-manager";
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

    startWhatsappSession(accountId).catch((err) => {
      console.error(`Failed to start session for account ${accountId}:`, err);
    });

    return NextResponse.json({
      success: true,
      message: "Connection initiated",
    });
  } catch (error) {
    console.error("Failed to connect account:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
