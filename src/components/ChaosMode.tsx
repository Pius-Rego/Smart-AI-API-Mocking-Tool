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
  Gauge,
  Flame,
} from "lucide-react";

const ERROR_TYPES = [
  { value: "500", label: "500 - Internal Server Error" },
  { value: "503", label: "503 - Service Unavailable" },
  { value: "404", label: "404 - Not Found" },
  { value: "timeout", label: "408 - Request Timeout" },
] as const;

const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_STYLES: Record<HttpMethod, { active: string; inactive: string }> = {
  GET: { 
    active: "bg-green-100 text-green-700 ring-2 ring-green-500 border-green-200", 
    inactive: "bg-gray-100 text-gray-400 border-gray-200" 
  },
  POST: { 
    active: "bg-blue-100 text-blue-700 ring-2 ring-blue-500 border-blue-200", 
    inactive: "bg-gray-100 text-gray-400 border-gray-200" 
  },
  PUT: { 
    active: "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 border-yellow-200", 
    inactive: "bg-gray-100 text-gray-400 border-gray-200" 
  },
  PATCH: { 
    active: "bg-orange-100 text-orange-700 ring-2 ring-orange-500 border-orange-200", 
    inactive: "bg-gray-100 text-gray-400 border-gray-200" 
  },
  DELETE: { 
    active: "bg-red-100 text-red-700 ring-2 ring-red-500 border-red-200", 
    inactive: "bg-gray-100 text-gray-400 border-gray-200" 
  },
};

export function ChaosMode() {
  const { currentEndpoint, updateEndpointSettings } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!currentEndpoint) {
    return null;
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
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 hover:from-gray-100 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "p-3 rounded-xl transition-all",
              chaosEnabled 
                ? "bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/30" 
                : "bg-gray-100 dark:bg-slate-700"
            )}
          >
            <Flame
              className={cn(
                "w-5 h-5",
                chaosEnabled ? "text-white" : "text-gray-400"
              )}
            />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Chaos Mode & Routing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {chaosEnabled
                ? `🔥 Active: ${settings.latency}ms delay, ${settings.errorRate}% error rate`
                : "Simulate real-world network conditions"}
            </p>
          </div>
        </div>
        <div className={cn(
          "p-2 rounded-xl transition-all",
          isExpanded ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" : "bg-gray-100 dark:bg-slate-700 text-gray-400"
        )}>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 space-y-8 border-t border-gray-100">
          {/* Info Banner */}
          <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-blue-800 mb-1">Test your app like it&apos;s in production</p>
              <p className="text-blue-600 leading-relaxed">
                Add delays to test loading states. Simulate errors to ensure your error handling works.
                Enable different HTTP methods to test full CRUD operations.
              </p>
            </div>
          </div>

          {/* Latency Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <label className="font-semibold text-gray-900">Response Latency</label>
                  <p className="text-xs text-gray-500">Simulate slow network conditions</p>
                </div>
              </div>
              <span className="text-lg font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl">
                {settings.latency}ms
              </span>
            </div>
            <div className="relative pt-2">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={settings.latency}
                onChange={(e) => handleLatencyChange(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0ms (instant)</span>
                <span>2500ms</span>
                <span>5000ms (5s)</span>
              </div>
            </div>
          </div>

          {/* Error Rate Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <label className="font-semibold text-gray-900">Error Rate</label>
                  <p className="text-xs text-gray-500">Percentage of requests that fail</p>
                </div>
              </div>
              <span className="text-lg font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-xl">
                {settings.errorRate}%
              </span>
            </div>
            <div className="relative pt-2">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.errorRate}
                onChange={(e) => handleErrorRateChange(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0% (never)</span>
                <span>50%</span>
                <span>100% (always)</span>
              </div>
            </div>
          </div>

          {/* Error Type Selector */}
          {settings.errorRate > 0 && (
            <div className="space-y-3 animate-fade-in">
              <label className="font-semibold text-gray-900">Error Type</label>
              <select
                value={settings.errorType}
                onChange={(e) => handleErrorTypeChange(e.target.value as typeof ERROR_TYPES[number]["value"])}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <label className="font-semibold text-gray-900">Supported HTTP Methods</label>
                <p className="text-xs text-gray-500">Enable methods to simulate full CRUD operations</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {HTTP_METHODS.map((method) => {
                const isEnabled = settings.supportedMethods.includes(method);
                return (
                  <button
                    key={method}
                    onClick={() => handleMethodToggle(method)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2",
                      isEnabled
                        ? METHOD_STYLES[method].active
                        : METHOD_STYLES[method].inactive
                    )}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-6 border-t border-gray-100">
            <label className="font-semibold text-gray-900 block mb-4">Quick Presets</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  handleLatencyChange(0);
                  handleErrorRateChange(0);
                }}
                className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl text-sm font-semibold hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200 flex items-center justify-center gap-2"
              >
                <span className="text-lg">✨</span>
                Perfect Server
              </button>
              <button
                onClick={() => {
                  handleLatencyChange(2000);
                  handleErrorRateChange(0);
                }}
                className="px-5 py-4 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 rounded-xl text-sm font-semibold hover:from-yellow-100 hover:to-amber-100 transition-all border border-yellow-200 flex items-center justify-center gap-2"
              >
                <span className="text-lg">🐌</span>
                Slow Network
              </button>
              <button
                onClick={() => {
                  handleLatencyChange(500);
                  handleErrorRateChange(10);
                }}
                className="px-5 py-4 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 rounded-xl text-sm font-semibold hover:from-orange-100 hover:to-amber-100 transition-all border border-orange-200 flex items-center justify-center gap-2"
              >
                <span className="text-lg">⚠️</span>
                Flaky Server
              </button>
              <button
                onClick={() => {
                  handleLatencyChange(3000);
                  handleErrorRateChange(30);
                }}
                className="px-5 py-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-xl text-sm font-semibold hover:from-red-100 hover:to-rose-100 transition-all border border-red-200 flex items-center justify-center gap-2"
              >
                <span className="text-lg">💥</span>
                Total Chaos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
