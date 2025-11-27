"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Book,
  Zap,
  Code,
  Server,
  Settings,
  Rocket,
  ChevronRight,
  Copy,
  Check,
  ArrowLeft,
  Search,
  ExternalLink,
  Terminal,
  FileJson,
  Shuffle,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

const sections: DocSection[] = [
  { id: "getting-started", title: "Getting Started", icon: Rocket },
  { id: "generating-mocks", title: "Generating Mocks", icon: Zap },
  { id: "endpoint-management", title: "Endpoint Management", icon: Server },
  { id: "chaos-mode", title: "Chaos Mode", icon: Shuffle },
  { id: "api-testing", title: "API Testing", icon: Play },
  { id: "api-reference", title: "API Reference", icon: Code },
  { id: "configuration", title: "Configuration", icon: Settings },
];

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:!text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-indigo-600" />
                <span className="font-bold !text-black">Documentation</span>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:!text-black"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.title}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {/* Getting Started */}
              {activeSection === "getting-started" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Rocket className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">Getting Started</h1>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    MockSmith AI helps you generate realistic API mock endpoints in seconds using AI. 
                    This guide will walk you through the basics of creating your first mock API.
                  </p>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Quick Start</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold !text-black m-0">Describe your API</h3>
                        <p className="text-gray-600 mt-1 mb-0">
                          Enter a natural language description of the API data you need.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold !text-black m-0">Generate mock data</h3>
                        <p className="text-gray-600 mt-1 mb-0">
                          Click "Generate" and AI will create realistic JSON responses.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold !text-black m-0">Use your endpoint</h3>
                        <p className="text-gray-600 mt-1 mb-0">
                          Copy the generated endpoint URL and use it in your application.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Example Prompt</h2>
                  <CodeBlock
                    code={`"List of 10 users with id, name, email, avatar, and role"`}
                    language="prompt"
                  />

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Using the Endpoint</h2>
                  <CodeBlock
                    code={`fetch('https://yourapp.com/api/mock/users-abc123')
  .then(res => res.json())
  .then(data => console.log(data));`}
                    language="javascript"
                  />
                </div>
              )}

              {/* Generating Mocks */}
              {activeSection === "generating-mocks" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">Generating Mocks</h1>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    MockSmith AI uses advanced language models to generate realistic mock data 
                    based on your natural language descriptions.
                  </p>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Writing Effective Prompts</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
                      <p className="font-semibold text-green-800 m-0">✓ Good Prompt</p>
                      <p className="text-green-700 mt-1 mb-0 font-mono text-sm">
                        "Array of 5 products with id, name, price (USD), category, inStock boolean, and createdAt timestamp"
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-xl">
                      <p className="font-semibold text-red-800 m-0">✗ Vague Prompt</p>
                      <p className="text-red-700 mt-1 mb-0 font-mono text-sm">
                        "Some product data"
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Prompt Tips</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li>Specify the data structure (array, object, nested)</li>
                    <li>Include field names and data types</li>
                    <li>Mention the number of items you need</li>
                    <li>Add context for realistic values (e.g., "US phone numbers")</li>
                  </ul>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Example Prompts</h2>
                  <CodeBlock
                    code={`// E-commerce products
"10 products with id, name, description, price, discountPercent, images array, category, rating"

// User profiles
"5 user profiles with firstName, lastName, email, phone, address object (street, city, country), avatar URL"

// Blog posts
"3 blog posts with title, slug, excerpt, content, author object, tags array, publishedAt, readingTime"`}
                    language="examples"
                  />
                </div>
              )}

              {/* Endpoint Management */}
              {activeSection === "endpoint-management" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Server className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">Endpoint Management</h1>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    Manage your generated mock endpoints, organize them by project, and share them with your team.
                  </p>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Endpoint Features</h2>
                  
                  <div className="grid gap-4">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <FileJson className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold !text-black m-0">JSON Editor</h3>
                        <p className="text-gray-600 mt-1 mb-0">
                          Edit the mock response data directly in the built-in JSON editor with syntax highlighting.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <Copy className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold !text-black m-0">Copy URL</h3>
                        <p className="text-gray-600 mt-1 mb-0">
                          One-click copy of the endpoint URL for easy integration into your code.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <Terminal className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold !text-black m-0">API Tester</h3>
                        <p className="text-gray-600 mt-1 mb-0">
                          Test your endpoints with different HTTP methods directly from the dashboard.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">URL Structure</h2>
                  <CodeBlock
                    code={`# Base URL pattern
/api/mock/{endpoint-slug}

# Example
/api/mock/users-abc123
/api/mock/products-xyz789`}
                    language="bash"
                  />
                </div>
              )}

              {/* Chaos Mode */}
              {activeSection === "chaos-mode" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Shuffle className="w-6 h-6 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">Chaos Mode</h1>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    Chaos Mode allows you to simulate real-world API behavior by adding random delays, 
                    error responses, and network issues to test your application's resilience.
                  </p>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Features</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold !text-black m-0">⏱️ Response Delay</h3>
                      <p className="text-gray-600 mt-1 mb-0">
                        Add artificial latency (0-5000ms) to simulate slow network conditions.
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold !text-black m-0">❌ Error Rate</h3>
                      <p className="text-gray-600 mt-1 mb-0">
                        Configure a percentage of requests to fail with error responses (500, 503, etc.).
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold !text-black m-0">🔀 HTTP Methods</h3>
                      <p className="text-gray-600 mt-1 mb-0">
                        Enable or disable specific HTTP methods (GET, POST, PUT, PATCH, DELETE).
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Preset Configurations</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-semibold text-green-800 m-0">🌈 Stable</h4>
                      <p className="text-sm text-green-700 mt-1 mb-0">No delays, no errors</p>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h4 className="font-semibold text-yellow-800 m-0">🐌 Slow</h4>
                      <p className="text-sm text-yellow-700 mt-1 mb-0">1-2s delay, 5% errors</p>
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <h4 className="font-semibold text-orange-800 m-0">💥 Unstable</h4>
                      <p className="text-sm text-orange-700 mt-1 mb-0">Variable delay, 20% errors</p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <h4 className="font-semibold text-red-800 m-0">☠️ Chaos</h4>
                      <p className="text-sm text-red-700 mt-1 mb-0">High delay, 50% errors</p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Testing */}
              {activeSection === "api-testing" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Play className="w-6 h-6 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">API Testing</h1>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    Test your mock endpoints with different HTTP methods and request bodies 
                    directly from the MockSmith dashboard.
                  </p>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Supported Methods</h2>
                  
                  <div className="flex flex-wrap gap-2 not-prose">
                    <span className="px-3 py-1 bg-green-500 text-white font-mono text-sm rounded-lg font-bold">GET</span>
                    <span className="px-3 py-1 bg-blue-500 text-white font-mono text-sm rounded-lg font-bold">POST</span>
                    <span className="px-3 py-1 bg-yellow-500 text-white font-mono text-sm rounded-lg font-bold">PUT</span>
                    <span className="px-3 py-1 bg-orange-500 text-white font-mono text-sm rounded-lg font-bold">PATCH</span>
                    <span className="px-3 py-1 bg-red-500 text-white font-mono text-sm rounded-lg font-bold">DELETE</span>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Response Information</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>Status Code:</strong> HTTP status (200, 201, 400, 500, etc.)</li>
                    <li><strong>Response Time:</strong> Time taken to receive the response in milliseconds</li>
                    <li><strong>Response Body:</strong> Full JSON response with syntax highlighting</li>
                    <li><strong>Copy Response:</strong> One-click copy of the response data</li>
                  </ul>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Example Request</h2>
                  <CodeBlock
                    code={`// POST request with body
fetch('/api/mock/users-abc123', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'john',
    email: 'john@example.com'
  })
});`}
                    language="javascript"
                  />
                </div>
              )}

              {/* API Reference */}
              {activeSection === "api-reference" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Code className="w-6 h-6 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">API Reference</h1>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Generate Endpoint</h2>
                  <CodeBlock
                    code={`POST /api/generate

Request Body:
{
  "prompt": "5 users with id, name, and email",
  "apiKey": "optional-gemini-api-key"
}

Response:
{
  "success": true,
  "endpoint": {
    "id": "abc123",
    "slug": "users-abc123",
    "data": [...],
    "settings": {...}
  }
}`}
                    language="http"
                  />

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Get Mock Data</h2>
                  <CodeBlock
                    code={`GET /api/mock/{slug}

Response:
{
  "users": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    ...
  ]
}`}
                    language="http"
                  />

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Update Endpoint</h2>
                  <CodeBlock
                    code={`PATCH /api/endpoints/{id}

Request Body:
{
  "data": {...},
  "settings": {
    "delay": 1000,
    "errorRate": 10,
    "supportedMethods": ["GET", "POST"]
  }
}`}
                    language="http"
                  />
                </div>
              )}

              {/* Configuration */}
              {activeSection === "configuration" && (
                <div className="prose prose-slate max-w-none">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gray-200 rounded-xl">
                      <Settings className="w-6 h-6 text-gray-600" />
                    </div>
                    <h1 className="text-3xl font-bold !text-black m-0">Configuration</h1>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Environment Variables</h2>
                  <CodeBlock
                    code={`# .env.local

# Gemini API Key (server-side, recommended)
GEMINI_API_KEY=your-api-key-here

# Require server-side API key
REQUIRE_SERVER_KEY=true`}
                    language="bash"
                  />

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">API Key Setup</h2>
                  <p className="text-gray-600">
                    For enhanced AI-generated mock data, you can configure a Gemini API key. 
                    There are two ways to set this up:
                  </p>

                  <div className="space-y-4 not-prose mt-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-semibold text-green-800">✓ Recommended: Server-side</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Set <code className="bg-green-100 px-1 rounded">GEMINI_API_KEY</code> in your <code className="bg-green-100 px-1 rounded">.env.local</code> file.
                        This keeps your API key secure and never exposes it to the client.
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h4 className="font-semibold text-yellow-800">⚠️ Alternative: Client-side</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Enter your API key in the dashboard input field.
                        Note: This stores the key in localStorage and sends it with each request.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold !text-black mt-8 mb-4">Get a Gemini API Key</h2>
                  <p className="text-gray-600">
                    Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                    Google AI Studio <ExternalLink className="w-4 h-4 inline" /></a> to create a free API key.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
