import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { mockStorage } from "@/lib/storage";
import { generateContextAwareData, generateSchema } from "@/lib/generator";
import { generateEndpointSlug } from "@/lib/utils";
import { MockEndpoint, DEFAULT_SETTINGS } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate context-aware mock data
    const data = generateContextAwareData(prompt);
    const schema = generateSchema(data);

    // Create the endpoint
    const endpoint: MockEndpoint = {
      id: uuidv4(),
      slug: generateEndpointSlug(prompt),
      name: extractEndpointName(prompt),
      prompt,
      schema,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: { ...DEFAULT_SETTINGS },
    };

    // Save to storage
    mockStorage.create(endpoint);

    return NextResponse.json({
      success: true,
      endpoint,
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate mock data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const endpoints = mockStorage.getAll();
    return NextResponse.json({ success: true, endpoints });
  } catch (error) {
    console.error("Get endpoints error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch endpoints" },
      { status: 500 }
    );
  }
}

function extractEndpointName(prompt: string): string {
  // Extract a meaningful name from the prompt
  const words = prompt
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 4);

  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
