import { MockEndpoint } from "./types";
import fs from "fs";
import path from "path";

// File-based persistent storage for mock endpoints
// Data survives server restarts!
const DATA_FILE = path.join(process.cwd(), "mock-data.json");

class MockStorage {
  private endpoints: Map<string, MockEndpoint> = new Map();
  private initialized: boolean = false;

  private loadFromFile(): void {
    if (this.initialized) return;
    
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          parsed.forEach((endpoint: MockEndpoint) => {
            this.endpoints.set(endpoint.id, endpoint);
          });
        }
        console.log(`✅ Loaded ${this.endpoints.size} endpoints from storage`);
      }
    } catch (error) {
      console.error("Error loading from file:", error);
    }
    this.initialized = true;
  }

  private saveToFile(): void {
    try {
      const data = Array.from(this.endpoints.values());
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving to file:", error);
    }
  }

  create(endpoint: MockEndpoint): MockEndpoint {
    this.loadFromFile();
    this.endpoints.set(endpoint.id, endpoint);
    this.saveToFile();
    return endpoint;
  }

  getById(id: string): MockEndpoint | undefined {
    this.loadFromFile();
    return this.endpoints.get(id);
  }

  getBySlug(slug: string): MockEndpoint | undefined {
    this.loadFromFile();
    for (const endpoint of this.endpoints.values()) {
      if (endpoint.slug === slug) {
        return endpoint;
      }
    }
    return undefined;
  }

  update(id: string, updates: Partial<MockEndpoint>): MockEndpoint | undefined {
    this.loadFromFile();
    const existing = this.endpoints.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.endpoints.set(id, updated);
    this.saveToFile();
    return updated;
  }

  delete(id: string): boolean {
    this.loadFromFile();
    const result = this.endpoints.delete(id);
    this.saveToFile();
    return result;
  }

  getAll(): MockEndpoint[] {
    this.loadFromFile();
    return Array.from(this.endpoints.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  clear(): void {
    this.endpoints.clear();
    this.saveToFile();
  }
}

// Singleton instance
export const mockStorage = new MockStorage();
