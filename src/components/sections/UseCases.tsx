"use client";

import { useState } from "react";
import { 
  Code2, 
  Smartphone, 
  TestTube, 
  GraduationCap,
  ChevronRight,
  Copy,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

const useCases = [
  {
    id: "frontend",
    icon: Smartphone,
    title: "Frontend Development",
    description:
      "Build and iterate on your UI without waiting for the backend. Create mock APIs that match your expected data structure and start coding immediately.",
    benefits: [
      "No backend dependency",
      "Rapid prototyping",
      "Realistic data for components",
      "Test edge cases easily",
    ],
    code: `// Fetch mock user data
const response = await fetch(
  'https://mockmaster.dev/api/mock/users-abc123'
);
const users = await response.json();

// Use in your React component
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  
  return (
    <ul>
      {users.map(user => (
        <UserCard key={user.id} {...user} />
      ))}
    </ul>
  );
}`,
  },
  {
    id: "testing",
    icon: TestTube,
    title: "API Integration Testing",
    description:
      "Test your API integration code with realistic responses. Simulate errors, timeouts, and edge cases without affecting your real backend.",
    benefits: [
      "Simulate all HTTP methods",
      "Test error handling",
      "Configurable response times",
      "Reproducible test scenarios",
    ],
    code: `// Test with Chaos Mode enabled
describe('API Error Handling', () => {
  it('should show error UI on 500', async () => {
    // MockMaster configured with 100% error rate
    const response = await fetch(mockEndpoint);
    
    expect(response.status).toBe(500);
    // Your error handling is triggered
  });
  
  it('should show loading state', async () => {
    // MockMaster configured with 3s latency
    const startTime = Date.now();
    await fetch(mockEndpoint);
    
    expect(Date.now() - startTime).toBeGreaterThan(2900);
  });
});`,
  },
  {
    id: "prototyping",
    icon: Code2,
    title: "Rapid Prototyping",
    description:
      "Demo your ideas with working APIs in minutes. Perfect for hackathons, client demos, and proof-of-concept development.",
    benefits: [
      "Instant API endpoints",
      "Shareable URLs",
      "No server setup",
      "Quick iterations",
    ],
    code: `// Create a mock e-commerce API in seconds
// Just describe: "20 products with name, 
// price, description, category, and image"

// Generated endpoint:
GET /api/mock/products-xyz789

// Response:
[
  {
    "id": "prod_001",
    "name": "Wireless Headphones Pro",
    "price": 149.99,
    "description": "Premium noise-canceling...",
    "category": "Electronics",
    "imageUrl": "https://..."
  },
  // ... 19 more realistic products
]`,
  },
  {
    id: "learning",
    icon: GraduationCap,
    title: "Learning & Education",
    description:
      "Perfect for tutorials, courses, and learning projects. Students can focus on frontend concepts without backend complexity.",
    benefits: [
      "Zero setup required",
      "Focus on learning",
      "No hosting costs",
      "Safe environment",
    ],
    code: `// Perfect for learning fetch API
async function learnFetching() {
  try {
    // Your own mock API - no CORS issues!
    const res = await fetch(myMockEndpoint);
    const data = await res.json();
    
    console.log('Success!', data);
  } catch (error) {
    // Learn error handling with
    // simulated failures
    console.error('Failed:', error);
  }
}

// Students can experiment freely
// without breaking anything`,
  },
];

export function UseCases() {
  const [activeCase, setActiveCase] = useState(useCases[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCase.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
            Use Cases
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Built for Every{" "}
            <span className="gradient-text">Developer Workflow</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Whether you're building, testing, learning, or demoing - 
            MockMaster adapts to your needs.
          </p>
        </div>

        {/* Use Cases Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Tab List */}
          <div className="space-y-4">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveCase(useCase)}
                className={cn(
                  "w-full p-6 rounded-xl text-left transition-all duration-300",
                  activeCase.id === useCase.id
                    ? "bg-white dark:bg-slate-900 shadow-lg border-2 border-indigo-500"
                    : "bg-white/50 dark:bg-slate-900/50 border-2 border-transparent hover:bg-white dark:hover:bg-slate-900 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                      activeCase.id === useCase.id
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                    )}
                  >
                    <useCase.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-lg font-bold mb-2 transition-colors",
                        activeCase.id === useCase.id
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-900 dark:text-white"
                      )}
                    >
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                    {activeCase.id === useCase.id && (
                      <ul className="mt-4 space-y-2">
                        {useCase.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <ChevronRight className="w-4 h-4 text-indigo-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Code Preview */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                {/* Code Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="ml-3 text-xs text-gray-400 font-mono">
                      example.tsx
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Code Content */}
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-300 font-mono whitespace-pre">
                      {activeCase.code}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Floating Label */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full shadow-lg">
                  {activeCase.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
