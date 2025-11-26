import { create } from "zustand";
import { MockEndpoint, EndpointSettings, DEFAULT_SETTINGS } from "./types";

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
  
  // Chaos Mode
  updateEndpointSettings: (id: string, settings: Partial<EndpointSettings>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
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
}));
