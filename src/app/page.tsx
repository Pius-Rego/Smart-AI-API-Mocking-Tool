"use client";

import { PromptInput } from "@/components/PromptInput";
import { JsonEditor } from "@/components/JsonEditor";
import { EndpointList } from "@/components/EndpointList";
import { ChaosMode } from "@/components/ChaosMode";
import { ApiTester } from "@/components/ApiTester";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { UseCases } from "@/components/sections/UseCases";
import { FAQ } from "@/components/sections/FAQ";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { currentEndpoint } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-main">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Interactive Demo
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Try It <span className="gradient-text">Right Now</span>
            </h2>
            <p className="text-xl text-gray-600">
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
                  <ChaosMode />
                  <ApiTester />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Use Cases Section */}
      <UseCases />

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
