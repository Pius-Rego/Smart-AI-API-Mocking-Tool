"use client";

import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, Check, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ApiKeyInput() {
  const { apiKey, setApiKey } = useAppStore();
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [setApiKey]);

  const maskApiKey = (key: string): string => {
    if (!key || key.length < 8) return "••••••••";
    return `${key.slice(0, 4)}${"•".repeat(Math.min(20, key.length - 8))}${key.slice(-4)}`;
  };

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
      localStorage.setItem("gemini_api_key", inputValue.trim());
      setInputValue("");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue("");
    setIsEditing(false);
  };

  const handleRemove = () => {
    setApiKey(null);
    localStorage.removeItem("gemini_api_key");
    setIsEditing(false);
  };

  if (apiKey && !isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Key className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Gemini API Key</p>
              <p className="text-sm text-gray-500 font-mono">
                {showKey ? apiKey : maskApiKey(apiKey)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={showKey ? "Hide API Key" : "Show API Key"}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Change
            </button>
            <button
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Key className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Gemini API Key Required</p>
          <p className="text-xs text-gray-500">
            Enter your API key to enable AI-powered mock generation
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={showKey ? "text" : "password"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your Gemini API key..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!inputValue.trim()}
          className={cn(
            "p-2 rounded-lg transition-colors",
            inputValue.trim()
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <Check className="w-5 h-5" />
        </button>
        {isEditing && (
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <p className="mt-2 text-xs text-gray-400">
        Get your API key from{" "}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          Google AI Studio
        </a>
      </p>
    </div>
  );
}
