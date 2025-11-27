import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { mockStorage } from "@/lib/storage";
import { generateContextAwareData, generateSchema } from "@/lib/generator";
import { generateEndpointSlug } from "@/lib/utils";
import { MockEndpoint, DEFAULT_SETTINGS } from "@/lib/types";

// Get the API key from environment variable (server-side only - never exposed to client)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
                text: `You are an expert mock data generator for API development and testing. Your task is to generate realistic, production-quality JSON mock data based on the user's request.

## CRITICAL RULES:
1. Return ONLY valid, parseable JSON - no markdown formatting, no code blocks (\`\`\`json), no explanatory text, no preamble, no postamble
2. The response must start with { or [ and end with } or ]
3. All strings must use double quotes, not single quotes
4. No trailing commas in objects or arrays
5. Use proper JSON data types: strings, numbers, booleans, null, arrays, objects

## DATA GENERATION GUIDELINES:

### User Request: "${prompt}"

### Quantity:
- If a specific number is mentioned (e.g., "5 users", "10 products"), generate exactly that many items
- If no number is specified, generate 5-10 items by default
- For single item requests (e.g., "a user profile"), return a single object, not an array

### Field Generation:
- Infer appropriate fields from the context (e.g., "users" → id, name, email, createdAt)
- Use realistic, diverse data that reflects real-world scenarios
- Include common fields even if not explicitly requested:
  * Timestamps: createdAt, updatedAt (ISO 8601 format)
  * IDs: Use sequential integers or realistic UUIDs
  * Status fields where appropriate (active, pending, completed, etc.)
  * Relational IDs if context suggests relationships (userId, productId, etc.)

### Data Realism:
- Names: Use diverse, international names (not just "John Doe")
- Emails: Match email to name format (firstname.lastname@domain.com)
- Dates: Use recent, realistic dates (within last 2 years unless specified)
- Phone numbers: Use proper formats with country codes
- Addresses: Include street, city, state/province, zip/postal code, country
- URLs: Use realistic domain names and paths
- Prices: Use appropriate decimal places and realistic ranges
- Text content: Generate contextually appropriate, varied text (not Lorem ipsum unless requested)
- Images: Use placeholder image URLs like https://picsum.photos/200/300?random=1
- Booleans: Use realistic distribution (not all true or all false)

### Domain-Specific Patterns:
Recognize common entities and apply best practices:

- **Users/People**: id, firstName, lastName, email, phone, avatar, role, status, createdAt
- **Products**: id, name, description, price, category, stock, imageUrl, rating, reviews
- **Posts/Articles**: id, title, content, author, tags, publishedAt, views, likes
- **Orders**: id, userId, items[], totalAmount, status, orderDate, shippingAddress
- **Comments**: id, userId, postId, content, createdAt, likes, replies[]
- **Events**: id, title, description, date, location, attendees, category
- **Todos/Tasks**: id, title, description, completed, priority, dueDate, assignedTo

### Data Structure:
- Return arrays for collections: [{"id": 1, ...}, {"id": 2, ...}]
- Return single objects for individual items: {"id": 1, "name": "...", ...}
- Nest objects appropriately (e.g., user: {id, name}, not userId and userName separately)
- Use arrays for one-to-many relationships where contextually appropriate

### Edge Cases:
- Include some variation in data (different string lengths, null values occasionally, varying numbers)
- For status fields, use realistic distributions (not all "active")
- For ratings, use realistic ranges (e.g., 3.5-4.8 stars, not all 5.0)
- For dates, ensure logical ordering (createdAt before updatedAt)

### Prohibited Content:
- Do not include sensitive/real personal information (SSNs, real credit cards, real passwords)
- Use fake but realistic-looking data
- For passwords/tokens, use placeholder strings like "hashed_password_here"

## OUTPUT FORMAT:
Return ONLY the JSON data. Your response should be immediately parseable by JSON.parse() without any preprocessing.

CORRECT ✓:
[{"id":1,"name":"Sarah Johnson","email":"sarah.johnson@example.com","role":"developer"}]

INCORRECT ✗:
\`\`\`json
[{"id":1,"name":"Sarah Johnson"}]
\`\`\`

INCORRECT ✗:
Here's your mock data:
[{"id":1,"name":"Sarah Johnson"}]

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
    const { prompt, apiKey: userApiKey } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Use user's API key if provided, otherwise use server's API key
    const apiKeyToUse = userApiKey || GEMINI_API_KEY;

    // Generate mock data - use Gemini if API key is available, otherwise use local generator
    let data: unknown;
    
    if (apiKeyToUse) {
      try {
        data = await generateWithGemini(prompt, apiKeyToUse);
      } catch (error) {
        console.error("Gemini API error:", error);
        // If user provided their own key and it failed, return the error
        if (userApiKey) {
          return NextResponse.json(
            { success: false, error: "Invalid API key or Gemini API error. Please check your API key." },
            { status: 400 }
          );
        }
        // Fallback to local generator if server's Gemini fails
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
