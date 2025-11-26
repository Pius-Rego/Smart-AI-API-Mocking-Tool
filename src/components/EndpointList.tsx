"use client";

import { useAppStore } from "@/lib/store";
import { MockEndpoint, HttpMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Clock,
  Zap,
  AlertTriangle,
  Globe,
  Trash2,
  ChevronRight,
  Activity,
} from "lucide-react";

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-orange-100 text-orange-700",
  DELETE: "bg-red-100 text-red-700",
};

export function EndpointList() {
  const { endpoints, currentEndpoint, setCurrentEndpoint, deleteEndpoint } = useAppStore();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this endpoint?")) {
      await fetch(`/api/endpoints/${id}`, { method: "DELETE" });
      deleteEndpoint(id);
    }
  };

  if (endpoints.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Endpoints Yet</h3>
          <p className="text-sm">
            Create your first mock API by describing what you need above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">Your Mock Endpoints</h3>
        <p className="text-sm text-gray-500">{endpoints.length} endpoint(s)</p>
      </div>

      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {endpoints.map((endpoint) => (
          <EndpointItem
            key={endpoint.id}
            endpoint={endpoint}
            isSelected={currentEndpoint?.id === endpoint.id}
            onSelect={() => setCurrentEndpoint(endpoint)}
            onDelete={(e) => handleDelete(endpoint.id, e)}
          />
        ))}
      </div>
    </div>
  );
}

interface EndpointItemProps {
  endpoint: MockEndpoint;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function EndpointItem({ endpoint, isSelected, onSelect, onDelete }: EndpointItemProps) {
  const hasChaosMode = endpoint.settings.latency > 0 || endpoint.settings.errorRate > 0;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50",
        isSelected && "bg-indigo-50 border-l-4 border-indigo-500"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 truncate">{endpoint.name}</h4>
            {hasChaosMode && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                <Activity className="w-3 h-3" />
                Chaos
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 truncate mt-1">
            /api/mock/{endpoint.slug}
          </p>

          {/* Method badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {endpoint.settings.supportedMethods.map((method) => (
              <span
                key={method}
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded",
                  METHOD_COLORS[method]
                )}
              >
                {method}
              </span>
            ))}
          </div>

          {/* Chaos Mode indicators */}
          {hasChaosMode && (
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {endpoint.settings.latency > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {endpoint.settings.latency}ms delay
                </span>
              )}
              {endpoint.settings.errorRate > 0 && (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {endpoint.settings.errorRate}% errors
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete endpoint"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <ChevronRight
            className={cn(
              "w-5 h-5 text-gray-400 transition-transform",
              isSelected && "rotate-90"
            )}
          />
        </div>
      </div>
    </div>
  );
}
