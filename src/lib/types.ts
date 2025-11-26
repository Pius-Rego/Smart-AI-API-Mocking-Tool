export interface MockEndpoint {
  id: string;
  slug: string;
  name: string;
  prompt: string;
  schema: Record<string, unknown>;
  data: unknown;
  createdAt: string;
  updatedAt: string;
  settings: EndpointSettings;
}

export interface EndpointSettings {
  // Chaos Mode settings
  latency: number; // milliseconds of delay
  errorRate: number; // percentage of requests that should fail (0-100)
  errorType: "500" | "503" | "404" | "timeout";

  // Dynamic routing settings
  supportedMethods: HttpMethod[];
  
  // Response customization
  customHeaders: Record<string, string>;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface GenerateRequest {
  prompt: string;
}

export interface GenerateResponse {
  success: boolean;
  endpoint?: MockEndpoint;
  error?: string;
}

export interface MockResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  timestamp: string;
  method: HttpMethod;
  simulatedLatency?: number;
}

export interface ChaosConfig {
  latency: number;
  errorRate: number;
  errorType: "500" | "503" | "404" | "timeout";
}

export const DEFAULT_SETTINGS: EndpointSettings = {
  latency: 0,
  errorRate: 0,
  errorType: "500",
  supportedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  customHeaders: {},
};

export const ERROR_RESPONSES = {
  "500": {
    status: 500,
    message: "Internal Server Error - The server encountered an unexpected condition.",
  },
  "503": {
    status: 503,
    message: "Service Unavailable - The server is temporarily unable to handle the request.",
  },
  "404": {
    status: 404,
    message: "Not Found - The requested resource could not be found.",
  },
  timeout: {
    status: 408,
    message: "Request Timeout - The server timed out waiting for the request.",
  },
};
