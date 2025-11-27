"use client";

import { useEffect } from "react";
import { PromptInput } from "@/components/PromptInput";
import { JsonEditor } from "@/components/JsonEditor";
import { EndpointList } from "@/components/EndpointList";
import { ChaosMode } from "@/components/ChaosMode";
import { PostmanTester } from "@/components/PostmanTester";
import { CodeSnippets } from "@/components/CodeSnippets";
import { ApiPlayground } from "@/components/ApiPlayground";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { UseCases } from "@/components/sections/UseCases";
import { FAQ } from "@/components/sections/FAQ";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { currentEndpoint, setEndpoints, setCurrentEndpoint } = useAppStore();

  // Load endpoints from server on mount (server file is source of truth)
  useEffect(() => {
    fetch("/api/endpoints")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.endpoints)) {
          setEndpoints(data.endpoints);
          // Set first endpoint as current if available
          if (data.endpoints.length > 0) {
            setCurrentEndpoint(data.endpoints[0]);
          }
        }
      })
      .catch(console.error);
  }, [setEndpoints, setCurrentEndpoint]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container-main">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              Interactive Demo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Try It <span className="gradient-text">Right Now</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              No signup required. Describe what you need and get a working API in seconds.
            </p>
          </div>

          {/* Prompt Input */}
          <div className="mb-12">
            <PromptInput />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Endpoints List */}
            <div className="lg:col-span-1 space-y-6">
              <EndpointList />
            </div>

            {/* Right Column - Editor & Controls */}
            <div className="lg:col-span-2 space-y-6">
              <JsonEditor />
              {currentEndpoint && (
                <>
                  <CodeSnippets />
                  <ChaosMode />
                  <PostmanTester />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* API Playground Section */}
      <section id="playground" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="container-main">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-4">
              API Playground
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Test <span className="text-orange-500">Any API</span> Instantly
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A built-in Postman-like tester. Try the ReqRes.in examples or test your own endpoints.
            </p>
          </div>

          {/* API Playground */}
          <div className="max-w-5xl mx-auto">
            <ApiPlayground />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <UseCases />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
