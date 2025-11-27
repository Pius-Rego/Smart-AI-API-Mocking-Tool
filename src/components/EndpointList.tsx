"use client";

import { useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { MockEndpoint, HttpMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  AlertTriangle,
  Globe,
  Trash2,
  ChevronRight,
  Activity,
  Database,
  Download,
  Upload,
  Trash,
  Check,
} from "lucide-react";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  POST: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  PUT: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  PATCH: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  DELETE: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

export function EndpointList() {
  const { endpoints, currentEndpoint, setCurrentEndpoint, deleteEndpoint, exportEndpoints, importEndpoints, clearAllEndpoints } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this endpoint?")) {
      await fetch(`/api/endpoints/${id}`, { method: "DELETE" });
      deleteEndpoint(id);
    }
  };

  const handleExport = () => {
    const json = exportEndpoints();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-endpoints-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const json = event.target?.result as string;
      const success = await importEndpoints(json);
      if (success) {
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 2000);
      } else {
        alert("Failed to import. Please check the JSON format.");
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be imported again
    e.target.value = "";
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to delete ALL endpoints? This cannot be undone.")) {
      // Clear from server too
      await fetch("/api/sync", { method: "DELETE" });
      clearAllEndpoints();
    }
  };

  if (endpoints.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center">
            <Database className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No Endpoints Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
            Create your first mock API by describing what you need in the input above.
          </p>
          {/* Import button for empty state */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import from JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Your Mock Endpoints</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''} created</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleExport}
              title="Export all endpoints"
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import endpoints"
              className={cn(
                "p-2 rounded-lg transition-colors",
                importSuccess 
                  ? "text-green-600 bg-green-50 dark:bg-green-900/30" 
                  : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              )}
            >
              {importSuccess ? <Check className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            </button>
            <button
              onClick={handleClearAll}
              title="Clear all endpoints"
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
        {endpoints.map((endpoint) => (
          <EndpointItem
            key={endpoint.id}
            endpoint={endpoint}
            isSelected={currentEndpoint?.id === endpoint.id}
            onSelect={() => setCurrentEndpoint(endpoint)}
            onDelete={(e) => handleDelete(endpoint.id, e)}
          />
        ))}
      </div>
    </div>
  );
}

interface EndpointItemProps {
  endpoint: MockEndpoint;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function EndpointItem({ endpoint, isSelected, onSelect, onDelete }: EndpointItemProps) {
  const hasChaosMode = endpoint.settings.latency > 0 || endpoint.settings.errorRate > 0;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "px-6 py-5 cursor-pointer transition-all duration-200",
        isSelected 
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-l-4 border-indigo-500" 
          : "hover:bg-gray-50 dark:hover:bg-slate-700"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className={cn(
              "font-semibold truncate transition-colors",
              isSelected ? "text-indigo-700 dark:text-indigo-400" : "text-gray-900 dark:text-white"
            )}>
              {endpoint.name}
            </h4>
            {hasChaosMode && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-800">
                <Activity className="w-3 h-3" />
                Chaos
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-3 font-mono">
            /api/mock/{endpoint.slug}
          </p>

          {/* Method badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {endpoint.settings.supportedMethods.map((method) => (
              <span
                key={method}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-md border",
                  METHOD_COLORS[method]
                )}
              >
                {method}
              </span>
            ))}
          </div>

          {/* Chaos Mode indicators */}
          {hasChaosMode && (
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              {endpoint.settings.latency > 0 && (
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-blue-500" />
                  {endpoint.settings.latency}ms
                </span>
              )}
              {endpoint.settings.errorRate > 0 && (
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  {endpoint.settings.errorRate}% errors
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onDelete}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
            title="Delete endpoint"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronRight
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform duration-200",
              isSelected && "rotate-90 text-indigo-500"
            )}
          />
        </div>
      </div>
    </div>
  );
}
