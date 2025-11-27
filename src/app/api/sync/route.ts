import { NextRequest, NextResponse } from "next/server";
import { mockStorage } from "@/lib/storage";
import { MockEndpoint } from "@/lib/types";

// POST - Sync/restore endpoints to server storage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoints } = body;

    if (!Array.isArray(endpoints)) {
      return NextResponse.json(
        { success: false, error: "Endpoints must be an array" },
        { status: 400 }
      );
    }

    // Add each endpoint to server storage
    let synced = 0;
    for (const endpoint of endpoints) {
      if (endpoint.id && endpoint.slug && endpoint.data) {
        mockStorage.create(endpoint as MockEndpoint);
        synced++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${synced} endpoints to server`,
      synced,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync endpoints" },
      { status: 500 }
    );
  }
}

// DELETE - Clear all endpoints from server storage
export async function DELETE() {
  try {
    mockStorage.clear();
    return NextResponse.json({
      success: true,
      message: "All endpoints cleared from server",
    });
  } catch (error) {
    console.error("Clear error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear endpoints" },
      { status: 500 }
    );
  }
}
