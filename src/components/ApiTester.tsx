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
  Terminal,
  Send,
} from "lucide-react";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-green-500 border-green-600",
  POST: "bg-blue-500 border-blue-600",
  PUT: "bg-yellow-500 border-yellow-600",
  PATCH: "bg-orange-500 border-orange-600",
  DELETE: "bg-red-500 border-red-600",
};

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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
            <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">API Tester</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Test your endpoint with different HTTP methods</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Method Selector & URL */}
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as HttpMethod)}
              className={cn(
                "appearance-none px-5 py-3.5 pr-10 border-2 rounded-xl font-bold text-sm text-white cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
                METHOD_COLORS[selectedMethod],
                `focus:ring-${selectedMethod.toLowerCase()}-400`
              )}
            >
              {METHODS.map((method) => (
                <option key={method} value={method} className="bg-gray-900">
                  {method}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              ▼
            </div>
          </div>

          <input
            type="text"
            value={endpointUrl}
            readOnly
            className="flex-1 px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm text-gray-600 focus:outline-none"
          />

          <button
            onClick={handleTest}
            disabled={isLoading || !isMethodSupported}
            className={cn(
              "px-6 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all",
              isMethodSupported
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Send
          </button>
        </div>

        {!isMethodSupported && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-700 text-sm animate-fade-in">
            <span className="text-lg">⚠️</span>
            <span>
              <strong>{selectedMethod}</strong> is not enabled for this endpoint. Enable it in Chaos Mode settings above.
            </span>
          </div>
        )}

        {/* Request Body (for POST, PUT, PATCH) */}
        {["POST", "PUT", "PATCH"].includes(selectedMethod) && (
          <div className="space-y-3 animate-fade-in">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              Request Body
              <span className="text-xs font-normal text-gray-500">(JSON)</span>
            </label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full h-36 px-5 py-4 font-mono text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
              placeholder='{ "key": "value" }'
            />
          </div>
        )}

        {/* Response */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                {result.success ? (
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
                <div>
                  <span
                    className={cn(
                      "font-mono font-bold text-lg",
                      result.success ? "text-green-700" : "text-red-700"
                    )}
                  >
                    {result.status}
                  </span>
                  <span className="text-gray-500 ml-2">{result.statusText}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono font-semibold">{result.responseTime}ms</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Response Body */}
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono">Response Body</span>
                <span className="text-xs text-gray-500">application/json</span>
              </div>
              <pre className="p-5 text-sm text-green-400 overflow-x-auto max-h-80 font-mono leading-relaxed">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
