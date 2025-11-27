"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { MockEndpoint } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Edit3,
  Save,
  X,
  RefreshCw,
  ExternalLink,
  Code2,
  FileJson,
  Link2,
} from "lucide-react";

export function JsonEditor() {
  const { currentEndpoint, updateEndpoint } = useAppStore();
  const [editMode, setEditMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (currentEndpoint) {
      setJsonText(JSON.stringify(currentEndpoint.data, null, 2));
      setEditMode(false);
      setError(null);
    }
  }, [currentEndpoint?.id]);

  if (!currentEndpoint) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 p-12">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center">
            <Code2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No Endpoint Selected</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Generate a mock API above or select one from your endpoints list to view and edit the response data.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const parsedData = JSON.parse(jsonText);
      setError(null);

      // Update locally
      updateEndpoint(currentEndpoint.id, { data: parsedData });

      // Update on server
      await fetch(`/api/endpoints/${currentEndpoint.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsedData }),
      });

      setEditMode(false);
    } catch (e) {
      setError("Invalid JSON format. Please check your syntax.");
    }
  };

  const handleCancel = () => {
    setJsonText(JSON.stringify(currentEndpoint.data, null, 2));
    setEditMode(false);
    setError(null);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const endpointUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/mock/${currentEndpoint.slug}`
    : `/api/mock/${currentEndpoint.slug}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
              <FileJson className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{currentEndpoint.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                {currentEndpoint.prompt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2.5 text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all shadow-sm"
                  title="Save"
                >
                  <Save className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleCopy(jsonText, "json")}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                  title="Copy JSON"
                >
                  {copied === "json" ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                  title="Edit JSON"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Endpoint URL */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wide">
                Live Endpoint URL
              </p>
            </div>
            <code className="text-sm text-indigo-900 dark:text-indigo-200 font-mono bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg truncate block border border-indigo-200 dark:border-indigo-800">
              {endpointUrl}
            </code>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleCopy(endpointUrl, "url")}
              className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all"
              title="Copy URL"
            >
              {copied === "url" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <a
              href={endpointUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* JSON Editor */}
      <div className="relative">
        {error && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 z-10">
            <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-xs font-bold">!</span>
            {error}
          </div>
        )}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          readOnly={!editMode}
          className={cn(
            "w-full h-[400px] p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed",
            editMode
              ? "bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-amber-100 border-l-4 border-amber-400"
              : "bg-gray-900 text-green-400",
            error && "pt-16"
          )}
          spellCheck={false}
        />
        
        {/* Edit Mode Indicator */}
        {editMode && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
            Editing Mode
          </div>
        )}
      </div>

      {/* Footer with Schema Info */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              {Array.isArray(currentEndpoint.data) ? "Array" : "Object"}
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>
              {Array.isArray(currentEndpoint.data)
                ? `${currentEndpoint.data.length} items`
                : `${Object.keys(currentEndpoint.data as object).length} fields`}
            </span>
          </div>
          <span className="text-gray-400">
            Updated {new Date(currentEndpoint.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
