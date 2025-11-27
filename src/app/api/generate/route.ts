import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { mockStorage } from "@/lib/storage";
import { generateContextAwareData, generateSchema } from "@/lib/generator";
import { generateEndpointSlug } from "@/lib/utils";
import { MockEndpoint, DEFAULT_SETTINGS } from "@/lib/types";

async function generateWithGemini(prompt: string, apiKey: string): Promise<unknown> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a mock data generator. Generate realistic JSON mock data based on this request: "${prompt}"

IMPORTANT: Return ONLY valid JSON data, no markdown, no code blocks, no explanation. Just the raw JSON.

The data should be realistic and contextually appropriate. If the request mentions a number of items, generate that many. Include relevant fields based on the context.

Example: If asked for "5 users with name and email", return:
[{"id":1,"name":"John Smith","email":"john.smith@email.com"},{"id":2,"name":"Jane Doe","email":"jane.doe@email.com"},...]

Generate the mock data now:`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to generate with Gemini");
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No response from Gemini");
  }

  // Clean up the response - remove markdown code blocks if present
  let cleanedText = text.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.slice(7);
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.slice(3);
  }
  if (cleanedText.endsWith("```")) {
    cleanedText = cleanedText.slice(0, -3);
  }
  cleanedText = cleanedText.trim();

  return JSON.parse(cleanedText);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, apiKey } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate mock data - use Gemini if API key provided, otherwise use local generator
    let data: unknown;
    
    if (apiKey) {
      try {
        data = await generateWithGemini(prompt, apiKey);
      } catch (error) {
        console.error("Gemini API error:", error);
        // Fallback to local generator if Gemini fails
        data = generateContextAwareData(prompt);
      }
    } else {
      data = generateContextAwareData(prompt);
    }
    
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
