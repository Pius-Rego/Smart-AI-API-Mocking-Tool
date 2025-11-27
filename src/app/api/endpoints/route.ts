import { NextResponse } from "next/server";
import { mockStorage } from "@/lib/storage";

export async function GET() {
  try {
    const endpoints = mockStorage.getAll();
    return NextResponse.json({ success: true, endpoints });
  } catch (error) {
    console.error("List endpoints error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}
