"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { HttpMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Zap,
  Clock,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

const ERROR_TYPES = [
  { value: "500", label: "500 - Internal Server Error" },
  { value: "503", label: "503 - Service Unavailable" },
  { value: "404", label: "404 - Not Found" },
  { value: "timeout", label: "408 - Request Timeout" },
] as const;

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function ChaosMode() {
  const { currentEndpoint, updateEndpointSettings } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!currentEndpoint) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chaos Mode</h3>
          <p className="text-sm">
            Select an endpoint to configure chaos mode and dynamic routing.
          </p>
        </div>
      </div>
    );
  }

  const { settings } = currentEndpoint;

  const handleLatencyChange = async (latency: number) => {
    updateEndpointSettings(currentEndpoint.id, { latency });
    await saveSettings({ latency });
  };

  const handleErrorRateChange = async (errorRate: number) => {
    updateEndpointSettings(currentEndpoint.id, { errorRate });
    await saveSettings({ errorRate });
  };

  const handleErrorTypeChange = async (errorType: typeof ERROR_TYPES[number]["value"]) => {
    updateEndpointSettings(currentEndpoint.id, { errorType });
    await saveSettings({ errorType });
  };

  const handleMethodToggle = async (method: HttpMethod) => {
    const currentMethods = settings.supportedMethods;
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter((m) => m !== method)
      : [...currentMethods, method];
    
    // Ensure at least one method is always selected
    if (newMethods.length === 0) return;
    
    updateEndpointSettings(currentEndpoint.id, { supportedMethods: newMethods });
    await saveSettings({ supportedMethods: newMethods });
  };

  const saveSettings = async (updates: object) => {
    await fetch(`/api/endpoints/${currentEndpoint.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: { ...currentEndpoint.settings, ...updates },
      }),
    });
  };

  const chaosEnabled = settings.latency > 0 || settings.errorRate > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              chaosEnabled ? "bg-orange-100" : "bg-gray-100"
            )}
          >
            <Zap
              className={cn(
                "w-5 h-5",
                chaosEnabled ? "text-orange-600" : "text-gray-400"
              )}
            />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Chaos Mode & Routing</h3>
            <p className="text-sm text-gray-500">
              {chaosEnabled
                ? `Active: ${settings.latency}ms delay, ${settings.errorRate}% errors`
                : "Simulate real-world conditions"}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Test your app like it&apos;s in production</p>
              <p className="text-blue-600">
                Add delays to test loading states. Simulate errors to ensure your error handling works.
                Enable different HTTP methods to test full CRUD operations.
              </p>
            </div>
          </div>

          {/* Latency Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <label className="font-medium text-gray-900">Latency (Delay)</label>
              </div>
              <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {settings.latency}ms
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={settings.latency}
              onChange={(e) => handleLatencyChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0ms (instant)</span>
              <span>5000ms (5 seconds)</span>
            </div>
          </div>

          {/* Error Rate Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gray-500" />
                <label className="font-medium text-gray-900">Error Rate</label>
              </div>
              <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {settings.errorRate}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.errorRate}
              onChange={(e) => handleErrorRateChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0% (never fails)</span>
              <span>100% (always fails)</span>
            </div>
          </div>

          {/* Error Type Selector */}
          {settings.errorRate > 0 && (
            <div className="space-y-3">
              <label className="font-medium text-gray-900">Error Type</label>
              <select
                value={settings.errorType}
                onChange={(e) => handleErrorTypeChange(e.target.value as typeof ERROR_TYPES[number]["value"])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {ERROR_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* HTTP Methods (Dynamic Routing) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <label className="font-medium text-gray-900">Supported HTTP Methods</label>
            </div>
            <p className="text-sm text-gray-500">
              Enable methods to simulate full CRUD operations. Each method returns appropriate responses.
            </p>
            <div className="flex flex-wrap gap-2">
              {HTTP_METHODS.map((method) => {
                const isEnabled = settings.supportedMethods.includes(method);
                return (
                  <button
                    key={method}
                    onClick={() => handleMethodToggle(method)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                      isEnabled
                        ? method === "GET"
                          ? "bg-green-100 text-green-700 ring-2 ring-green-500"
                          : method === "POST"
                          ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                          : method === "PUT"
                          ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500"
                          : method === "PATCH"
                          ? "bg-orange-100 text-orange-700 ring-2 ring-orange-500"
                          : "bg-red-100 text-red-700 ring-2 ring-red-500"
                        : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-4 border-t border-gray-200">
            <label className="font-medium text-gray-900 block mb-3">Quick Presets</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleLatencyChange(0);
                  handleErrorRateChange(0);
                }}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
              >
                ✨ Perfect Server
              </button>
              <button
                onClick={() => {
                  handleLatencyChange(2000);
                  handleErrorRateChange(0);
                }}
                className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
              >
                🐌 Slow Network
              </button>
              <button
                onClick={() => {
                  handleLatencyChange(500);
                  handleErrorRateChange(10);
                }}
                className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
              >
                ⚠️ Flaky Server
              </button>
              <button
                onClick={() => {
                  handleLatencyChange(3000);
                  handleErrorRateChange(30);
                }}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                💥 Total Chaos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
