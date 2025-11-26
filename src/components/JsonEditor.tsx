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
} from "lucide-react";

export function JsonEditor() {
  const { currentEndpoint, updateEndpoint } = useAppStore();
  const [editMode, setEditMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentEndpoint) {
      setJsonText(JSON.stringify(currentEndpoint.data, null, 2));
      setEditMode(false);
      setError(null);
    }
  }, [currentEndpoint?.id]);

  if (!currentEndpoint) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Edit3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Endpoint Selected</h3>
          <p className="text-sm">
            Generate a mock API above or select one from your endpoints list.
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const endpointUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/api/mock/${currentEndpoint.slug}`
    : `/api/mock/${currentEndpoint.slug}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{currentEndpoint.name}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {currentEndpoint.prompt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  title="Save"
                >
                  <Save className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy JSON"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
      <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-100">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-600 font-medium mb-1">Your Live Endpoint</p>
            <code className="text-sm text-indigo-900 font-mono truncate block">
              {endpointUrl}
            </code>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => navigator.clipboard.writeText(endpointUrl)}
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="Copy URL"
            >
              <Copy className="w-4 h-4" />
            </button>
            <a
              href={endpointUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
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
          <div className="absolute top-0 left-0 right-0 p-3 bg-red-50 border-b border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          readOnly={!editMode}
          className={cn(
            "w-full h-[400px] p-4 font-mono text-sm resize-none focus:outline-none",
            editMode
              ? "bg-yellow-50 text-gray-900"
              : "bg-gray-900 text-green-400",
            error && "pt-16"
          )}
          spellCheck={false}
        />
      </div>

      {/* Footer with Schema Info */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Schema: {Array.isArray(currentEndpoint.data) ? "Array" : "Object"} •{" "}
            {Array.isArray(currentEndpoint.data)
              ? `${currentEndpoint.data.length} items`
              : `${Object.keys(currentEndpoint.data as object).length} fields`}
          </span>
          <span>
            Updated: {new Date(currentEndpoint.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
