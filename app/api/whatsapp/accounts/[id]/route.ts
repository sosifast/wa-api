import { prisma } from "@/lib/prisma";
import { deleteWhatsappAccount } from "@/lib/whatsapp-manager";
import { NextResponse } from "next/server";

export async function GET(
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

    return NextResponse.json({ success: true, data: account });
  } catch (error) {
    console.error("Failed to get account:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await deleteWhatsappAccount(accountId);

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
