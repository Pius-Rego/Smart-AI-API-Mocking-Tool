"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "I need an API for a list of 10 customized sneakers with price, color, size, and image URL",
  "Give me 5 users with name, email, avatar, and bio",
  "Create a product catalog with 20 items including name, price, description, category, and rating",
  "Generate 15 blog posts with title, content, author, date, and tags",
  "Mock an e-commerce order list with order number, total, status, and customer name",
];

export function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const [showExamples, setShowExamples] = useState(false);
  const { isGenerating, setIsGenerating, addEndpoint, setError, error, apiKey } = useAppStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), apiKey }),
      });

      const data = await response.json();

      if (data.success && data.endpoint) {
        addEndpoint(data.endpoint);
        setPrompt("");
      } else {
        setError(data.error || "Failed to generate mock API");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        {/* Main Input Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-xl focus-within:shadow-xl focus-within:border-indigo-300">
          <div className="flex items-start p-4">
            <Sparkles className="w-5 h-5 text-indigo-500 mt-3 mr-3 flex-shrink-0" />
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowExamples(true)}
              onBlur={() => setTimeout(() => setShowExamples(false), 200)}
              placeholder="Describe the API you need in plain English..."
              className="flex-1 resize-none border-0 bg-transparent text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none text-lg min-h-[60px] max-h-[200px] py-2"
              rows={1}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={cn(
                "ml-3 p-3 rounded-xl transition-all duration-200",
                prompt.trim() && !isGenerating
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Example Prompts */}
          {showExamples && !prompt && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2 font-medium">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPrompt(example);
                      setShowExamples(false);
                    }}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors truncate max-w-[300px]"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Enter</kbd> to generate or{" "}
        <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
