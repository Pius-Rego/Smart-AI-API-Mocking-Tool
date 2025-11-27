"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Loader2, Wand2 } from "lucide-react";
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
  const { isGenerating, setIsGenerating, addEndpoint, setError, error } = useAppStore();
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
        body: JSON.stringify({ prompt: prompt.trim() }),
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
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-200 dark:hover:border-indigo-800 focus-within:shadow-2xl focus-within:border-indigo-400 dark:focus-within:border-indigo-600">
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="flex items-start p-5 pt-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mr-4 flex-shrink-0">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowExamples(true)}
              onBlur={() => setTimeout(() => setShowExamples(false), 200)}
              placeholder="Describe the API you need in plain English..."
              className="flex-1 resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none text-lg min-h-[60px] max-h-[200px] py-2 leading-relaxed"
              rows={1}
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={cn(
                "ml-4 p-4 rounded-xl transition-all duration-300 flex-shrink-0",
                prompt.trim() && !isGenerating
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
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
            <div className="border-t border-gray-100 dark:border-slate-700 px-5 py-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPrompt(example);
                      setShowExamples(false);
                    }}
                    className="text-xs px-4 py-2 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-full text-gray-600 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all truncate max-w-[300px] hover:scale-[1.02]"
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
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-fade-in">
            <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-500 dark:text-red-400 text-xs font-bold">!</span>
            </div>
            {error}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded text-xs font-mono">Enter</kbd> to generate
        </span>
        <span className="text-gray-300 dark:text-gray-600">•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded text-xs font-mono">Shift + Enter</kbd> for new line
        </span>
      </p>
    </div>
  );
}
