"use client";

import { useState } from "react";
import { HttpMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Send,
  Plus,
  Trash2,
  ChevronDown,
  FileJson,
  Code,
  Settings2,
  Bookmark,
  ExternalLink,
} from "lucide-react";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLORS: Record<HttpMethod, { bg: string; text: string }> = {
  GET: { bg: "bg-green-500", text: "text-green-500" },
  POST: { bg: "bg-yellow-500", text: "text-yellow-500" },
  PUT: { bg: "bg-blue-500", text: "text-blue-500" },
  PATCH: { bg: "bg-purple-500", text: "text-purple-500" },
  DELETE: { bg: "bg-red-500", text: "text-red-500" },
};

// Preset API examples
const EXAMPLE_APIS = [
  {
    name: "List Users",
    method: "GET" as HttpMethod,
    url: "https://reqres.in/api/users?page=2",
    body: "",
    description: "Get paginated list of users",
  },
  {
    name: "Single User",
    method: "GET" as HttpMethod,
    url: "https://reqres.in/api/users/2",
    body: "",
    description: "Get a specific user by ID",
  },
  {
    name: "Create User",
    method: "POST" as HttpMethod,
    url: "https://reqres.in/api/users",
    body: '{\n  "name": "morpheus",\n  "job": "leader"\n}',
    description: "Create a new user",
  },
  {
    name: "Update User",
    method: "PUT" as HttpMethod,
    url: "https://reqres.in/api/users/2",
    body: '{\n  "name": "morpheus",\n  "job": "zion resident"\n}',
    description: "Update an existing user",
  },
  {
    name: "Delete User",
    method: "DELETE" as HttpMethod,
    url: "https://reqres.in/api/users/2",
    body: "",
    description: "Delete a user",
  },
  {
    name: "Login",
    method: "POST" as HttpMethod,
    url: "https://reqres.in/api/login",
    body: '{\n  "email": "eve.holt@reqres.in",\n  "password": "cityslicka"\n}',
    description: "Simulate user login",
  },
];

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface QueryParam {
  key: string;
  value: string;
  enabled: boolean;
}

interface TestResult {
  status: number;
  statusText: string;
  data: unknown;
  responseTime: number;
  success: boolean;
  headers: Record<string, string>;
  size: number;
}

type RequestTab = "params" | "headers" | "body";
type ResponseTab = "body" | "headers";

export function ApiPlayground() {
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod>("GET");
  const [customUrl, setCustomUrl] = useState("https://reqres.in/api/users?page=2");
  const [requestBody, setRequestBody] = useState('{\n  "name": "morpheus",\n  "job": "leader"\n}');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState<RequestTab>("params");
  const [activeResponseTab, setActiveResponseTab] = useState<ResponseTab>("body");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const [headers, setHeaders] = useState<Header[]>([
    { key: "Content-Type", value: "application/json", enabled: true },
  ]);

  const [queryParams, setQueryParams] = useState<QueryParam[]>([
    { key: "", value: "", enabled: true },
  ]);

  const loadExample = (example: typeof EXAMPLE_APIS[0]) => {
    setSelectedMethod(example.method);
    setCustomUrl(example.url);
    setRequestBody(example.body);
    setShowExamples(false);
    setResult(null);
    if (example.method === "POST" || example.method === "PUT" || example.method === "PATCH") {
      setActiveRequestTab("body");
    } else {
      setActiveRequestTab("params");
    }
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "", enabled: true }]);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const updateQueryParam = (index: number, field: keyof QueryParam, value: string | boolean) => {
    const newParams = [...queryParams];
    newParams[index] = { ...newParams[index], [field]: value };
    setQueryParams(newParams);
  };

  const buildUrl = () => {
    const enabledParams = queryParams.filter((p) => p.enabled && p.key);
    if (enabledParams.length === 0) return customUrl;

    const queryString = enabledParams
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");

    return `${customUrl}${customUrl.includes("?") ? "&" : "?"}${queryString}`;
  };

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    const startTime = performance.now();
    const finalUrl = buildUrl();

    try {
      const headerObj: Record<string, string> = {};
      headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => {
          headerObj[h.key] = h.value;
        });

      const options: RequestInit = {
        method: selectedMethod,
        headers: headerObj,
      };

      if (["POST", "PUT", "PATCH"].includes(selectedMethod) && requestBody.trim()) {
        try {
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch {
          setResult({
            status: 0,
            statusText: "Invalid JSON",
            data: { error: "Request body is not valid JSON" },
            responseTime: 0,
            success: false,
            headers: {},
            size: 0,
          });
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(finalUrl, options);
      const endTime = performance.now();
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResult({
        status: response.status,
        statusText: response.statusText,
        data,
        responseTime: Math.round(endTime - startTime),
        success: response.ok,
        headers: responseHeaders,
        size: new Blob([text]).size,
      });
    } catch (error) {
      const endTime = performance.now();
      setResult({
        status: 0,
        statusText: "Network Error",
        data: { error: error instanceof Error ? error.message : "Failed to connect to the endpoint" },
        responseTime: Math.round(endTime - startTime),
        success: false,
        headers: {},
        size: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(
        typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Header with Examples */}
      <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Send className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-bold text-white">API Playground</h3>
            <p className="text-xs text-slate-400">Test any REST API endpoint</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            Examples
            <ChevronDown className={cn("w-4 h-4 transition-transform", showExamples && "rotate-180")} />
          </button>

          {showExamples && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-lg overflow-hidden z-50 shadow-xl">
              <div className="px-3 py-2 border-b border-slate-700">
                <p className="text-xs text-slate-400 font-medium">ReqRes.in API Examples</p>
              </div>
              {EXAMPLE_APIS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => loadExample(example)}
                  className="w-full px-3 py-2.5 text-left hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-slate-700/50 last:border-0"
                >
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-bold",
                      METHOD_COLORS[example.method].bg,
                      "text-white"
                    )}
                  >
                    {example.method}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{example.name}</p>
                    <p className="text-xs text-slate-400 truncate">{example.description}</p>
                  </div>
                </button>
              ))}
              <div className="px-3 py-2 bg-slate-700/50">
                <a
                  href="https://reqres.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit ReqRes.in for more
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* URL Bar */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex gap-2">
          {/* Method Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMethodDropdown(!showMethodDropdown)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm min-w-[110px] justify-between transition-all",
                METHOD_COLORS[selectedMethod].bg,
                "text-white hover:opacity-90"
              )}
            >
              {selectedMethod}
              <ChevronDown
                className={cn("w-4 h-4 transition-transform", showMethodDropdown && "rotate-180")}
              />
            </button>

            {showMethodDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg overflow-hidden z-50 min-w-[110px] shadow-xl">
                {METHODS.map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      setSelectedMethod(method);
                      setShowMethodDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm font-bold hover:bg-slate-700 transition-colors",
                      METHOD_COLORS[method].text
                    )}
                  >
                    {method}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter request URL"
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />

          {/* Send Button */}
          <button
            onClick={handleTest}
            disabled={isLoading || !customUrl}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center gap-2 transition-all hover:shadow-lg"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Send
          </button>
        </div>
      </div>

      {/* Request Section */}
      <div className="border-b border-slate-700">
        {/* Request Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800/50">
          <button
            onClick={() => setActiveRequestTab("params")}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors relative",
              activeRequestTab === "params" ? "text-orange-500" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Query Params
            {queryParams.filter((p) => p.enabled && p.key).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                {queryParams.filter((p) => p.enabled && p.key).length}
              </span>
            )}
            {activeRequestTab === "params" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveRequestTab("headers")}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors relative",
              activeRequestTab === "headers" ? "text-orange-500" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Headers
            {headers.filter((h) => h.enabled && h.key).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">
                {headers.filter((h) => h.enabled && h.key).length}
              </span>
            )}
            {activeRequestTab === "headers" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveRequestTab("body")}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors relative",
              activeRequestTab === "body" ? "text-orange-500" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Body
            {activeRequestTab === "body" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>

        {/* Request Content */}
        <div className="p-4 min-h-[200px]">
          {/* Query Params Tab */}
          {activeRequestTab === "params" && (
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs text-slate-400 font-medium px-2">
                <div className="w-6"></div>
                <div>KEY</div>
                <div>VALUE</div>
                <div className="w-8"></div>
              </div>
              {queryParams.map((param, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => updateQueryParam(index, "enabled", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => updateQueryParam(index, "key", e.target.value)}
                    placeholder="Key"
                    className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => updateQueryParam(index, "value", e.target.value)}
                    placeholder="Value"
                    className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => removeQueryParam(index)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addQueryParam}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-orange-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Parameter
              </button>
            </div>
          )}

          {/* Headers Tab */}
          {activeRequestTab === "headers" && (
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs text-slate-400 font-medium px-2">
                <div className="w-6"></div>
                <div>KEY</div>
                <div>VALUE</div>
                <div className="w-8"></div>
              </div>
              {headers.map((header, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, "enabled", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                    placeholder="Key"
                    className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(index, "value", e.target.value)}
                    placeholder="Value"
                    className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addHeader}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-orange-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Header
              </button>
            </div>
          )}

          {/* Body Tab */}
          {activeRequestTab === "body" && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="radio"
                    name="bodyType"
                    defaultChecked
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  raw
                </label>
                <span className="px-3 py-1 bg-slate-700 rounded text-orange-400 text-xs font-mono">
                  JSON
                </span>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-40 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-green-400 font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
                placeholder='{ "key": "value" }'
              />
            </div>
          )}
        </div>
      </div>

      {/* Response Section */}
      {result && (
        <div className="animate-fade-in">
          {/* Response Status Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
            <div className="flex items-center gap-4">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={cn("font-bold text-lg", result.success ? "text-green-500" : "text-red-500")}>
                {result.status} {result.statusText}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-green-400">{result.responseTime} ms</span>
              </span>
              <span className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                <span className="font-mono text-green-400">{formatSize(result.size)}</span>
              </span>
            </div>
          </div>

          {/* Response Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-800/30">
            <button
              onClick={() => setActiveResponseTab("body")}
              className={cn(
                "px-5 py-3 text-sm font-medium transition-colors relative flex items-center gap-2",
                activeResponseTab === "body" ? "text-orange-500" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Code className="w-4 h-4" />
              Body
              {activeResponseTab === "body" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
            <button
              onClick={() => setActiveResponseTab("headers")}
              className={cn(
                "px-5 py-3 text-sm font-medium transition-colors relative flex items-center gap-2",
                activeResponseTab === "headers" ? "text-orange-500" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Settings2 className="w-4 h-4" />
              Headers
              <span className="px-1.5 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                {Object.keys(result.headers).length}
              </span>
              {activeResponseTab === "headers" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
          </div>

          {/* Response Content */}
          <div className="relative">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors z-10"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>

            {activeResponseTab === "body" && (
              <pre className="p-4 text-sm text-green-400 font-mono overflow-auto max-h-96 leading-relaxed">
                {typeof result.data === "string" ? result.data : JSON.stringify(result.data, null, 2)}
              </pre>
            )}

            {activeResponseTab === "headers" && (
              <div className="p-4 space-y-1">
                {Object.entries(result.headers).map(([key, value]) => (
                  <div key={key} className="flex text-sm font-mono">
                    <span className="text-cyan-400 min-w-[200px]">{key}:</span>
                    <span className="text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty Response State */}
      {!result && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Send className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm">Click Send to get a response</p>
          <p className="text-xs mt-2 text-slate-600">
            Try the Examples dropdown for quick API tests
          </p>
        </div>
      )}
    </div>
  );
}
