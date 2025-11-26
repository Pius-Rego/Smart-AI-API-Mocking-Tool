import { NextRequest, NextResponse } from "next/server";
import { mockStorage } from "@/lib/storage";
import { sleep, shouldFail } from "@/lib/utils";
import { ERROR_RESPONSES, HttpMethod, MockResponse } from "@/lib/types";

// This is the dynamic mock endpoint handler
// It supports all HTTP methods and implements Chaos Mode

async function handleMockRequest(
  request: NextRequest,
  slug: string,
  method: HttpMethod
) {
  try {
    const endpoint = mockStorage.getBySlug(slug);

    if (!endpoint) {
      return NextResponse.json(
        {
          success: false,
          error: "Mock endpoint not found",
          message: `No mock endpoint exists with slug: ${slug}`,
        },
        { status: 404 }
      );
    }

    // Check if the method is supported
    if (!endpoint.settings.supportedMethods.includes(method)) {
      return NextResponse.json(
        {
          success: false,
          error: "Method not allowed",
          message: `This endpoint does not support ${method} requests`,
          supportedMethods: endpoint.settings.supportedMethods,
        },
        { status: 405 }
      );
    }

    // === CHAOS MODE: Latency Simulation ===
    if (endpoint.settings.latency > 0) {
      await sleep(endpoint.settings.latency);
    }

    // === CHAOS MODE: Error Rate Simulation ===
    if (shouldFail(endpoint.settings.errorRate)) {
      const errorInfo = ERROR_RESPONSES[endpoint.settings.errorType];
      return NextResponse.json(
        {
          success: false,
          error: errorInfo.message,
          simulatedError: true,
          errorType: endpoint.settings.errorType,
          timestamp: new Date().toISOString(),
        },
        { status: errorInfo.status }
      );
    }

    // === DYNAMIC ROUTING: Handle different HTTP methods ===
    let responseData: MockResponse;
    let body: unknown = null;

    // Parse body for methods that support it
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        body = await request.json();
      } catch {
        // Body might be empty or not JSON
        body = null;
      }
    }

    switch (method) {
      case "GET":
        responseData = {
          success: true,
          data: endpoint.data,
          message: "Data retrieved successfully",
          timestamp: new Date().toISOString(),
          method,
          simulatedLatency: endpoint.settings.latency,
        };
        break;

      case "POST":
        // Simulate creating a new resource
        responseData = {
          success: true,
          data: {
            id: crypto.randomUUID(),
            ...((body as object) || {}),
            createdAt: new Date().toISOString(),
          },
          message: "Resource created successfully",
          timestamp: new Date().toISOString(),
          method,
          simulatedLatency: endpoint.settings.latency,
        };
        break;

      case "PUT":
      case "PATCH":
        // Simulate updating a resource
        responseData = {
          success: true,
          data: {
            ...((body as object) || {}),
            updatedAt: new Date().toISOString(),
          },
          message: `Resource ${method === "PUT" ? "replaced" : "updated"} successfully`,
          timestamp: new Date().toISOString(),
          method,
          simulatedLatency: endpoint.settings.latency,
        };
        break;

      case "DELETE":
        // Simulate deleting a resource
        responseData = {
          success: true,
          data: null,
          message: "Resource deleted successfully",
          timestamp: new Date().toISOString(),
          method,
          simulatedLatency: endpoint.settings.latency,
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Method not supported" },
          { status: 405 }
        );
    }

    // Build response with custom headers
    const response = NextResponse.json(responseData);

    // Add custom headers if configured
    if (endpoint.settings.customHeaders) {
      for (const [key, value] of Object.entries(endpoint.settings.customHeaders)) {
        response.headers.set(key, value);
      }
    }

    // Add CORS headers for easy frontend testing
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  } catch (error) {
    console.error("Mock endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleMockRequest(request, slug, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleMockRequest(request, slug, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleMockRequest(request, slug, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleMockRequest(request, slug, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return handleMockRequest(request, slug, "DELETE");
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
