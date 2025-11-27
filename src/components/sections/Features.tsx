"use client";

import {
  Sparkles,
  Zap,
  Database,
  RefreshCw,
  Shield,
  Code2,
  Timer,
  AlertTriangle,
  Globe,
  Layers,
  Palette,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Describe your API in plain English. Our AI understands context and generates realistic, appropriate mock data instantly.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: Zap,
    title: "Instant Live Endpoints",
    description:
      "Get a working API URL immediately. No setup, no configuration, no backend required. Just describe and deploy.",
    color: "from-yellow-500 to-orange-600",
  },
  {
    icon: Database,
    title: "Realistic Test Data",
    description:
      "Generate contextually appropriate data - names that look like names, emails that are valid, prices that make sense.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Timer,
    title: "Latency Simulation",
    description:
      "Add configurable delays to test loading states, spinners, and skeleton screens. Prepare your app for slow networks.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: AlertTriangle,
    title: "Error Simulation",
    description:
      "Inject random errors at configurable rates. Test error handling, retry logic, and fallback UI components.",
    color: "from-red-500 to-pink-600",
  },
  {
    icon: Globe,
    title: "Full REST Support",
    description:
      "All HTTP methods supported - GET, POST, PUT, PATCH, DELETE. Each returns appropriate responses for full CRUD testing.",
    color: "from-indigo-500 to-purple-600",
  },
];

const additionalFeatures = [
  { icon: Layers, text: "Schema auto-generation" },
  { icon: Code2, text: "Code snippets in 5+ languages" },
  { icon: RefreshCw, text: "Data regeneration on demand" },
  { icon: Shield, text: "No data stored on our servers" },
  { icon: Palette, text: "Customizable response format" },
  { icon: Rocket, text: "Zero configuration needed" },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Mock Like a Pro</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powerful features designed for modern frontend development. 
            Build faster, test better, ship with confidence.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br",
                  feature.color
                )}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Features Bar */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Plus many more features...
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-gray-200 dark:border-slate-700"
              >
                <feature.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
