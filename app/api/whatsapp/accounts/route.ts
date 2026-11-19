import { prisma } from "@/lib/prisma";
import { startWhatsappSession } from "@/lib/whatsapp-manager";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accounts = await prisma.whatsappAccount.findMany({
      orderBy: {
        create_at: "desc",
      },
    });

    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    console.error("Failed to fetch whatsapp accounts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Account name is required" },
        { status: 400 }
      );
    }

    const account = await prisma.whatsappAccount.create({
      data: {
        name: name.trim(),
        status: "CONNECTING",
      },
    });

    // Start Baileys session in background to generate QR
    startWhatsappSession(account.id).catch((err) => {
      console.error(`Failed to start session for account ${account.id}:`, err);
    });

    return NextResponse.json({ success: true, data: account });
  } catch (error) {
    console.error("Failed to create whatsapp account:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
