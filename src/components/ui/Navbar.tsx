"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Zap, Menu, X, Github, BookOpen, ChevronDown, Key, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Examples", href: "/examples" },
  { label: "Docs", href: "/docs" },
];

const toolsLinks = [
  { label: "API Key Tester", href: "/tools/api-key-tester", icon: Key, description: "Verify if your API keys work" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-nav shadow-sm border-b border-gray-200/50"
            : "bg-transparent"
        )}
      >
        <div className="container-main">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Mock<span className="text-indigo-600">Master</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Tools Dropdown */}
              <div ref={toolsRef} className="relative">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                  Tools
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isToolsOpen && "rotate-180")} />
                </button>
                
                {isToolsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in z-50">
                    {toolsLinks.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setIsToolsOpen(false)}
                          className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Icon className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{tool.label}</div>
                            <div className="text-xs text-gray-500">{tool.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <Link
                href="#demo"
                className="btn btn-primary text-sm"
              >
                Try Free Demo
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "mobile-menu-overlay md:hidden",
          isMobileMenuOpen && "open"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={cn(
          "mobile-menu md:hidden",
          isMobileMenuOpen && "open"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Mock<span className="text-indigo-600">Master</span>
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors border-b border-gray-100"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Tools Section */}
            <div className="py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Tools</div>
              {toolsLinks.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {tool.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-primary w-full justify-center"
            >
              Try Free Demo
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full justify-center"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
