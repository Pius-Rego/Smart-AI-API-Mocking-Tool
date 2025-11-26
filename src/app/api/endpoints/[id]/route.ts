import { NextRequest, NextResponse } from "next/server";
import { mockStorage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const endpoint = mockStorage.getById(id);

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "Endpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, endpoint });
  } catch (error) {
    console.error("Get endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch endpoint" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const endpoint = mockStorage.update(id, body);

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "Endpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, endpoint });
  } catch (error) {
    console.error("Update endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update endpoint" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = mockStorage.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Endpoint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Endpoint deleted" });
  } catch (error) {
    console.error("Delete endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete endpoint" },
      { status: 500 }
    );
  }
}
