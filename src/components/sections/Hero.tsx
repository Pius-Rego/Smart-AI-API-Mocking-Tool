"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles, Users, Globe, Zap } from "lucide-react";

const stats = [
  { value: "10K+", label: "Developers", icon: Users },
  { value: "1M+", label: "API Calls", icon: Globe },
  { value: "50K+", label: "Endpoints Created", icon: Zap },
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
      <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-200" />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-400" />

      <div className="container-main relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-gray-200 dark:border-slate-700 mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Mock API Generation
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6 animate-fade-in-up delay-100">
              Mock REST APIs in{" "}
              <span className="gradient-text">Seconds</span>
              , Not Hours
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
              Describe what you need in plain English. Get a live API endpoint with 
              realistic data instantly. No backend required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-in-up delay-300">
              <Link
                href="#demo"
                className="btn btn-primary text-base px-8 py-4"
              >
                Try Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/docs"
                className="btn btn-secondary text-base px-8 py-4"
              >
                <Play className="w-5 h-5" />
                View Documentation
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 animate-fade-in-up delay-400">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual/Demo */}
          <div className="relative animate-fade-in-up delay-300">
            <div className="relative">
              {/* Main Demo Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-slate-800 rounded-md px-3 py-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                      mockmaster.dev/api/mock/users-abc123
                    </div>
                  </div>
                </div>

                {/* Input Section */}
                <div className="p-6 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-800 dark:to-slate-800">
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      "Give me 5 users with name, email, and avatar"
                    </span>
                  </div>
                </div>

                {/* Output Section */}
                <div className="p-6 bg-gray-900">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded">
                      200 OK
                    </span>
                    <span className="text-gray-500 text-xs">• 142ms</span>
                  </div>
                  <pre className="text-sm text-gray-300 font-mono overflow-hidden">
{`[
  {
    "id": "usr_001",
    "name": "Sarah Johnson",
    "email": "sarah.j@email.com",
    "avatar": "https://i.pravatar.cc/150?u=1"
  },
  {
    "id": "usr_002",
    "name": "Michael Chen",
    "email": "m.chen@email.com",
    "avatar": "https://i.pravatar.cc/150?u=2"
  },
  // ... 3 more users
]`}
                  </pre>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg shadow-lg animate-float">
                ✓ Live Endpoint
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg animate-float delay-200">
                ⚡ Instant Response
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
