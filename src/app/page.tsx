"use client";

import { PromptInput } from "@/components/PromptInput";
import { JsonEditor } from "@/components/JsonEditor";
import { EndpointList } from "@/components/EndpointList";
import { ChaosMode } from "@/components/ChaosMode";
import { ApiTester } from "@/components/ApiTester";
import { useAppStore } from "@/lib/store";
import { Zap, Code2, TestTube, Sparkles } from "lucide-react";

export default function Home() {
  const { currentEndpoint } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart API Mocker</h1>
                <p className="text-sm text-gray-500">AI-Powered Mock API Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                v1.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Prompt Input */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Mock APIs with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Plain English
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what you need, get a live API endpoint instantly. Test with chaos mode,
            simulate errors, and build faster.
          </p>
        </div>

        <PromptInput />

        {/* Features Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <FeaturePill icon={<Sparkles className="w-4 h-4" />} text="AI-Generated Data" />
          <FeaturePill icon={<Code2 className="w-4 h-4" />} text="Live Endpoints" />
          <FeaturePill icon={<Zap className="w-4 h-4" />} text="Chaos Mode" />
          <FeaturePill icon={<TestTube className="w-4 h-4" />} text="Built-in Tester" />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Endpoints List */}
          <div className="lg:col-span-1 space-y-6">
            <EndpointList />
          </div>

          {/* Right Column - Editor & Controls */}
          <div className="lg:col-span-2 space-y-6">
            <JsonEditor />
            {currentEndpoint && (
              <>
                <ChaosMode />
                <ApiTester />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Quick Start</h4>
              <ol className="text-sm text-gray-600 space-y-2">
                <li>1. Describe your API in plain English</li>
                <li>2. Get instant mock data with a live URL</li>
                <li>3. Edit the JSON to customize</li>
                <li>4. Use Chaos Mode to test edge cases</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Chaos Mode</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Add latency to test loading states</li>
                <li>• Simulate errors at custom rates</li>
                <li>• Test all HTTP methods (GET, POST, etc.)</li>
                <li>• Use presets for common scenarios</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">API Methods</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><code className="bg-green-100 text-green-700 px-1 rounded">GET</code> Returns mock data</li>
                <li><code className="bg-blue-100 text-blue-700 px-1 rounded">POST</code> Simulates creation</li>
                <li><code className="bg-yellow-100 text-yellow-700 px-1 rounded">PUT/PATCH</code> Simulates update</li>
                <li><code className="bg-red-100 text-red-700 px-1 rounded">DELETE</code> Simulates deletion</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            Built for developers who move fast ⚡
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
      <span className="text-indigo-600">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  );
}
