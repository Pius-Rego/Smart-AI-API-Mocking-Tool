"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, Copy, Code, Terminal, FileCode2 } from "lucide-react";

type SnippetType = "fetch" | "axios" | "curl" | "python";

const SNIPPET_TABS: { id: SnippetType; label: string; icon: React.ReactNode }[] = [
  { id: "fetch", label: "Fetch", icon: <Code className="w-4 h-4" /> },
  { id: "axios", label: "Axios", icon: <FileCode2 className="w-4 h-4" /> },
  { id: "curl", label: "cURL", icon: <Terminal className="w-4 h-4" /> },
  { id: "python", label: "Python", icon: <FileCode2 className="w-4 h-4" /> },
];

export function CodeSnippets() {
  const { currentEndpoint } = useAppStore();
  const [activeTab, setActiveTab] = useState<SnippetType>("fetch");
  const [copied, setCopied] = useState(false);

  if (!currentEndpoint) {
    return null;
  }

  const endpointUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/mock/${currentEndpoint.slug}`
      : `/api/mock/${currentEndpoint.slug}`;

  const generateSnippet = (type: SnippetType): string => {
    switch (type) {
      case "fetch":
        return `// JavaScript Fetch API
fetch('${endpointUrl}')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Your code here
  })
  .catch(error => console.error('Error:', error));`;

      case "axios":
        return `// Using Axios
import axios from 'axios';

axios.get('${endpointUrl}')
  .then(response => {
    console.log(response.data);
    // Your code here
  })
  .catch(error => console.error('Error:', error));

// Or with async/await
const fetchData = async () => {
  try {
    const { data } = await axios.get('${endpointUrl}');
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};`;

      case "curl":
        return `# cURL Command
curl -X GET "${endpointUrl}" \\
  -H "Content-Type: application/json"

# With pretty print (requires jq)
curl -s "${endpointUrl}" | jq .

# POST request example
curl -X POST "${endpointUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "example", "value": 123}'`;

      case "python":
        return `# Python with requests library
import requests

# GET request
response = requests.get('${endpointUrl}')
data = response.json()
print(data)

# POST request example
payload = {"name": "example", "value": 123}
response = requests.post('${endpointUrl}', json=payload)
print(response.json())

# With error handling
try:
    response = requests.get('${endpointUrl}')
    response.raise_for_status()
    data = response.json()
    print(data)
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")`;

      default:
        return "";
    }
  };

  const handleCopy = async () => {
    const snippet = generateSnippet(activeTab);
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const snippet = generateSnippet(activeTab);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
              <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Code Snippets</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ready-to-use code for your project</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              copied
                ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
        {SNIPPET_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="relative">
        <pre className="p-6 bg-gray-900 text-gray-100 text-sm font-mono overflow-x-auto leading-relaxed max-h-[350px]">
          <code>{snippet}</code>
        </pre>

        {/* Language Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-gray-800 text-gray-400 text-xs font-mono rounded">
          {activeTab === "fetch" && "javascript"}
          {activeTab === "axios" && "javascript"}
          {activeTab === "curl" && "bash"}
          {activeTab === "python" && "python"}
        </div>
      </div>

      {/* Footer with Tips */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {activeTab === "fetch" && "💡 Fetch is built into modern browsers. No installation needed."}
          {activeTab === "axios" && "💡 Install with: npm install axios"}
          {activeTab === "curl" && "💡 cURL is pre-installed on most Unix systems."}
          {activeTab === "python" && "💡 Install with: pip install requests"}
        </p>
      </div>
    </div>
  );
}
