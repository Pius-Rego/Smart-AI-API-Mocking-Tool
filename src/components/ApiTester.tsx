"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { HttpMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Play,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Check,
} from "lucide-react";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

interface TestResult {
  status: number;
  statusText: string;
  data: unknown;
  responseTime: number;
  success: boolean;
}

export function ApiTester() {
  const { currentEndpoint } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod>("GET");
  const [requestBody, setRequestBody] = useState('{\n  "username": "john",\n  "email": "john@example.com"\n}');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!currentEndpoint) {
    return null;
  }

  const endpointUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/mock/${currentEndpoint.slug}`
    : `/api/mock/${currentEndpoint.slug}`;

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method: selectedMethod,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (["POST", "PUT", "PATCH"].includes(selectedMethod)) {
        try {
          JSON.parse(requestBody); // Validate JSON
          options.body = requestBody;
        } catch {
          setResult({
            status: 0,
            statusText: "Invalid JSON",
            data: { error: "Request body is not valid JSON" },
            responseTime: 0,
            success: false,
          });
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(endpointUrl, options);
      const endTime = performance.now();
      const data = await response.json();

      setResult({
        status: response.status,
        statusText: response.statusText,
        data,
        responseTime: Math.round(endTime - startTime),
        success: response.ok,
      });
    } catch (error) {
      const endTime = performance.now();
      setResult({
        status: 0,
        statusText: "Network Error",
        data: { error: "Failed to connect to the endpoint" },
        responseTime: Math.round(endTime - startTime),
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMethodSupported = currentEndpoint.settings.supportedMethods.includes(selectedMethod);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">API Tester</h3>
        <p className="text-sm text-gray-500">Test your endpoint with different HTTP methods</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Method Selector & URL */}
        <div className="flex gap-2">
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as HttpMethod)}
            className={cn(
              "px-3 py-2 border rounded-lg font-medium text-sm focus:ring-2 focus:ring-indigo-500",
              selectedMethod === "GET" && "bg-green-50 border-green-300 text-green-700",
              selectedMethod === "POST" && "bg-blue-50 border-blue-300 text-blue-700",
              selectedMethod === "PUT" && "bg-yellow-50 border-yellow-300 text-yellow-700",
              selectedMethod === "PATCH" && "bg-orange-50 border-orange-300 text-orange-700",
              selectedMethod === "DELETE" && "bg-red-50 border-red-300 text-red-700"
            )}
          >
            {METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={endpointUrl}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-gray-600"
          />

          <button
            onClick={handleTest}
            disabled={isLoading || !isMethodSupported}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors",
              isMethodSupported
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Send
          </button>
        </div>

        {!isMethodSupported && (
          <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            ⚠️ {selectedMethod} is not enabled for this endpoint. Enable it in Chaos Mode settings.
          </p>
        )}

        {/* Request Body (for POST, PUT, PATCH) */}
        {["POST", "PUT", "PATCH"].includes(selectedMethod) && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Request Body (JSON)</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full h-32 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder='{ "key": "value" }'
            />
          </div>
        )}

        {/* Response */}
        {result && (
          <div className="space-y-3">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={cn(
                    "font-mono font-medium",
                    result.success ? "text-green-700" : "text-red-700"
                  )}
                >
                  {result.status} {result.statusText}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {result.responseTime}ms
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Response Body */}
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="p-4 text-sm text-green-400 overflow-x-auto max-h-80">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
