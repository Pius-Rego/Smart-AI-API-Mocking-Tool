import { MockEndpoint } from "./types";

// In-memory storage for mock endpoints
// In production, you'd use a database like MongoDB, PostgreSQL, or Redis
class MockStorage {
  private endpoints: Map<string, MockEndpoint> = new Map();

  create(endpoint: MockEndpoint): MockEndpoint {
    this.endpoints.set(endpoint.id, endpoint);
    return endpoint;
  }

  getById(id: string): MockEndpoint | undefined {
    return this.endpoints.get(id);
  }

  getBySlug(slug: string): MockEndpoint | undefined {
    for (const endpoint of this.endpoints.values()) {
      if (endpoint.slug === slug) {
        return endpoint;
      }
    }
    return undefined;
  }

  update(id: string, updates: Partial<MockEndpoint>): MockEndpoint | undefined {
    const existing = this.endpoints.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.endpoints.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.endpoints.delete(id);
  }

  getAll(): MockEndpoint[] {
    return Array.from(this.endpoints.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  clear(): void {
    this.endpoints.clear();
  }
}

// Singleton instance
export const mockStorage = new MockStorage();
