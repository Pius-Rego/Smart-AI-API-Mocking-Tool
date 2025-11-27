"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How is MockMaster different from other mock API tools?",
    answer:
      "MockMaster uses AI to understand your natural language descriptions and generate contextually appropriate mock data. Unlike static mock tools, our AI creates realistic, varied data that actually makes sense for your use case. Plus, you get instant live endpoints without any setup or backend infrastructure.",
  },
  {
    question: "Can I use MockMaster in production?",
    answer:
      "MockMaster is designed for development, testing, and prototyping purposes. While the endpoints are fully functional and persistent during your session, we recommend using it alongside your actual backend development rather than as a production replacement. It's perfect for frontend development, API integration testing, and demos.",
  },
  {
    question: "How realistic is the AI-generated data?",
    answer:
      "Very realistic! Our AI understands context and generates appropriate data. Ask for 'user profiles' and you'll get realistic names, emails, and avatars. Request 'e-commerce products' and you'll get proper prices, descriptions, and categories. The data follows realistic patterns and relationships.",
  },
  {
    question: "What happens to my mocked APIs?",
    answer:
      "Your mock endpoints are stored locally in your browser and persist across sessions. The data is available as long as you're using the same browser. For team collaboration or permanent storage, consider our Pro plan which offers cloud persistence and sharing features.",
  },
  {
    question: "Do I need an API key to use MockMaster?",
    answer:
      "No! MockMaster works out of the box with our built-in data generator powered by Faker.js. For enhanced AI-powered generation with more contextual understanding, you can optionally add your own Gemini API key. Both options produce high-quality mock data.",
  },
  {
    question: "What HTTP methods are supported?",
    answer:
      "All standard REST methods are supported: GET, POST, PUT, PATCH, and DELETE. Each method returns appropriate responses - GET returns your mock data, POST simulates creation, PUT/PATCH simulate updates, and DELETE simulates deletion. You can enable/disable methods per endpoint.",
  },
  {
    question: "What is Chaos Mode?",
    answer:
      "Chaos Mode lets you simulate real-world network conditions. Add latency to test loading states, simulate random errors at configurable rates, and test how your application handles timeouts and failures. It's perfect for building robust, resilient applications.",
  },
  {
    question: "Is there a rate limit?",
    answer:
      "The free tier has generous limits suitable for most development needs. Pro users get unlimited API calls with priority support. We don't throttle legitimate development usage - our goal is to help you build faster.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="container-main">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about MockMaster. Can't find the answer you're
            looking for? <a href="mailto:support@mockmaster.dev" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact our support team</a>.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 dark:border-slate-700 last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-8">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                    openIndex === index
                      ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  )}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                )}
              >
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pr-12">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
