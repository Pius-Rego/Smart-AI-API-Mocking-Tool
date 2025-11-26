import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateEndpointSlug(prompt: string): string {
  // Extract meaningful words and create a slug
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .slice(0, 3);

  return words.join("-") + "-" + Math.random().toString(36).substring(2, 8);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shouldFail(errorRate: number): boolean {
  return Math.random() * 100 < errorRate;
}
