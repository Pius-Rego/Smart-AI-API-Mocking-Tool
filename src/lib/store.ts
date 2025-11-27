import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MockEndpoint, EndpointSettings } from "./types";

interface AppState {
  // Endpoints
  endpoints: MockEndpoint[];
  currentEndpoint: MockEndpoint | null;
  
  // UI State
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  setEndpoints: (endpoints: MockEndpoint[]) => void;
  addEndpoint: (endpoint: MockEndpoint) => void;
  updateEndpoint: (id: string, updates: Partial<MockEndpoint>) => void;
  deleteEndpoint: (id: string) => void;
  setCurrentEndpoint: (endpoint: MockEndpoint | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  clearAllEndpoints: () => void;
  
  // Chaos Mode
  updateEndpointSettings: (id: string, settings: Partial<EndpointSettings>) => void;
  
  // Export/Import/Sync
  exportEndpoints: () => string;
  importEndpoints: (json: string) => Promise<boolean>;
  syncToServer: () => Promise<boolean>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      endpoints: [],
      currentEndpoint: null,
      isGenerating: false,
      error: null,

      setEndpoints: (endpoints) => set({ endpoints }),
      
      addEndpoint: (endpoint) =>
        set((state) => ({
          endpoints: [endpoint, ...state.endpoints],
          currentEndpoint: endpoint,
        })),

      updateEndpoint: (id, updates) =>
        set((state) => ({
          endpoints: state.endpoints.map((ep) =>
            ep.id === id ? { ...ep, ...updates, updatedAt: new Date().toISOString() } : ep
          ),
          currentEndpoint:
            state.currentEndpoint?.id === id
              ? { ...state.currentEndpoint, ...updates, updatedAt: new Date().toISOString() }
              : state.currentEndpoint,
        })),

      deleteEndpoint: (id) =>
        set((state) => ({
          endpoints: state.endpoints.filter((ep) => ep.id !== id),
          currentEndpoint: state.currentEndpoint?.id === id ? null : state.currentEndpoint,
        })),

      setCurrentEndpoint: (endpoint) => set({ currentEndpoint: endpoint }),
      
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      
      setError: (error) => set({ error }),
      
      clearAllEndpoints: () => set({ endpoints: [], currentEndpoint: null }),

      updateEndpointSettings: (id, settings) =>
        set((state) => ({
          endpoints: state.endpoints.map((ep) =>
            ep.id === id
              ? {
                  ...ep,
                  settings: { ...ep.settings, ...settings },
                  updatedAt: new Date().toISOString(),
                }
              : ep
          ),
          currentEndpoint:
            state.currentEndpoint?.id === id
              ? {
                  ...state.currentEndpoint,
                  settings: { ...state.currentEndpoint.settings, ...settings },
                  updatedAt: new Date().toISOString(),
                }
              : state.currentEndpoint,
        })),
        
      // Export all endpoints as JSON string
      exportEndpoints: () => {
        const { endpoints } = get();
        return JSON.stringify(endpoints, null, 2);
      },
      
      // Sync all endpoints to server
      syncToServer: async () => {
        const { endpoints } = get();
        try {
          const response = await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoints }),
          });
          return response.ok;
        } catch {
          return false;
        }
      },
      
      // Import endpoints from JSON string and sync to server
      importEndpoints: async (json: string) => {
        try {
          const imported = JSON.parse(json);
          if (Array.isArray(imported)) {
            // First sync to server
            const response = await fetch("/api/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ endpoints: imported }),
            });
            
            if (response.ok) {
              set((state) => ({
                endpoints: [...imported, ...state.endpoints],
                currentEndpoint: imported[0] || state.currentEndpoint,
              }));
              return true;
            }
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "mock-api-storage", // localStorage key
      partialize: (state) => ({ 
        endpoints: state.endpoints,
      }), // Only persist endpoints, not UI state
      onRehydrate: () => {
        // When localStorage data is loaded, fetch from server (source of truth)
        return (state, error) => {
          if (error) {
            console.error("Error rehydrating store:", error);
            return;
          }
          // Load from server file as source of truth
          fetch("/api/endpoints")
            .then((res) => res.json())
            .then((data) => {
              if (data.success && Array.isArray(data.endpoints)) {
                // Replace localStorage data with server data
                useAppStore.setState({ endpoints: data.endpoints });
              }
            })
            .catch(console.error);
        };
      },
    }
  )
);
