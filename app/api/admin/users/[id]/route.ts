import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session || session.level !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const params = await props.params;
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, level } = body;

    const dataToUpdate: {
      status?: "Active" | "In_Active";
      level?: "Member" | "Admin";
    } = {};

    if (status === "Active" || status === "In-Active") {
      dataToUpdate.status = status === "Active" ? "Active" : "In_Active";
    }

    if (level === "Member" || level === "Admin") {
      dataToUpdate.level = level;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session || session.level !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const params = await props.params;
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID" },
        { status: 400 }
      );
    }

    // Do not allow deleting self
    if (session.userId === userId) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus akun Anda sendiri" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
