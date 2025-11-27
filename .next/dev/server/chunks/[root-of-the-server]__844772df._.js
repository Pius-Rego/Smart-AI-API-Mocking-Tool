module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockStorage",
    ()=>mockStorage
]);
// In-memory storage for mock endpoints
// In production, you'd use a database like MongoDB, PostgreSQL, or Redis
class MockStorage {
    endpoints = new Map();
    create(endpoint) {
        this.endpoints.set(endpoint.id, endpoint);
        return endpoint;
    }
    getById(id) {
        return this.endpoints.get(id);
    }
    getBySlug(slug) {
        for (const endpoint of this.endpoints.values()){
            if (endpoint.slug === slug) {
                return endpoint;
            }
        }
        return undefined;
    }
    update(id, updates) {
        const existing = this.endpoints.get(id);
        if (!existing) return undefined;
        const updated = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.endpoints.set(id, updated);
        return updated;
    }
    delete(id) {
        return this.endpoints.delete(id);
    }
    getAll() {
        return Array.from(this.endpoints.values()).sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    clear() {
        this.endpoints.clear();
    }
}
const mockStorage = new MockStorage();
}),
"[project]/src/lib/utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "generateEndpointSlug",
    ()=>generateEndpointSlug,
    "shouldFail",
    ()=>shouldFail,
    "sleep",
    ()=>sleep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-route] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function generateEndpointSlug(prompt) {
    // Extract meaningful words and create a slug
    const words = prompt.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((word)=>word.length > 2).slice(0, 3);
    return words.join("-") + "-" + Math.random().toString(36).substring(2, 8);
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function shouldFail(errorRate) {
    return Math.random() * 100 < errorRate;
}
}),
"[project]/src/lib/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SETTINGS",
    ()=>DEFAULT_SETTINGS,
    "ERROR_RESPONSES",
    ()=>ERROR_RESPONSES
]);
const DEFAULT_SETTINGS = {
    latency: 0,
    errorRate: 0,
    errorType: "500",
    supportedMethods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ],
    customHeaders: {}
};
const ERROR_RESPONSES = {
    "500": {
        status: 500,
        message: "Internal Server Error - The server encountered an unexpected condition."
    },
    "503": {
        status: 503,
        message: "Service Unavailable - The server is temporarily unable to handle the request."
    },
    "404": {
        status: 404,
        message: "Not Found - The requested resource could not be found."
    },
    timeout: {
        status: 408,
        message: "Request Timeout - The server timed out waiting for the request."
    }
};
}),
"[project]/src/app/api/mock/[slug]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "OPTIONS",
    ()=>OPTIONS,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/types.ts [app-route] (ecmascript)");
;
;
;
;
// This is the dynamic mock endpoint handler
// It supports all HTTP methods and implements Chaos Mode
async function handleMockRequest(request, slug, method) {
    try {
        const endpoint = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockStorage"].getBySlug(slug);
        if (!endpoint) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Mock endpoint not found",
                message: `No mock endpoint exists with slug: ${slug}`
            }, {
                status: 404
            });
        }
        // Check if the method is supported
        if (!endpoint.settings.supportedMethods.includes(method)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Method not allowed",
                message: `This endpoint does not support ${method} requests`,
                supportedMethods: endpoint.settings.supportedMethods
            }, {
                status: 405
            });
        }
        // === CHAOS MODE: Latency Simulation ===
        if (endpoint.settings.latency > 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sleep"])(endpoint.settings.latency);
        }
        // === CHAOS MODE: Error Rate Simulation ===
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shouldFail"])(endpoint.settings.errorRate)) {
            const errorInfo = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ERROR_RESPONSES"][endpoint.settings.errorType];
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: errorInfo.message,
                simulatedError: true,
                errorType: endpoint.settings.errorType,
                timestamp: new Date().toISOString()
            }, {
                status: errorInfo.status
            });
        }
        // === DYNAMIC ROUTING: Handle different HTTP methods ===
        let responseData;
        let body = null;
        // Parse body for methods that support it
        if ([
            "POST",
            "PUT",
            "PATCH"
        ].includes(method)) {
            try {
                body = await request.json();
            } catch  {
                // Body might be empty or not JSON
                body = null;
            }
        }
        switch(method){
            case "GET":
                responseData = {
                    success: true,
                    data: endpoint.data,
                    message: "Data retrieved successfully",
                    timestamp: new Date().toISOString(),
                    method,
                    simulatedLatency: endpoint.settings.latency
                };
                break;
            case "POST":
                // Simulate creating a new resource
                responseData = {
                    success: true,
                    data: {
                        id: crypto.randomUUID(),
                        ...body || {},
                        createdAt: new Date().toISOString()
                    },
                    message: "Resource created successfully",
                    timestamp: new Date().toISOString(),
                    method,
                    simulatedLatency: endpoint.settings.latency
                };
                break;
            case "PUT":
            case "PATCH":
                // Simulate updating a resource
                responseData = {
                    success: true,
                    data: {
                        ...body || {},
                        updatedAt: new Date().toISOString()
                    },
                    message: `Resource ${method === "PUT" ? "replaced" : "updated"} successfully`,
                    timestamp: new Date().toISOString(),
                    method,
                    simulatedLatency: endpoint.settings.latency
                };
                break;
            case "DELETE":
                // Simulate deleting a resource
                responseData = {
                    success: true,
                    data: null,
                    message: "Resource deleted successfully",
                    timestamp: new Date().toISOString(),
                    method,
                    simulatedLatency: endpoint.settings.latency
                };
                break;
            default:
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: "Method not supported"
                }, {
                    status: 405
                });
        }
        // Build response with custom headers
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responseData);
        // Add custom headers if configured
        if (endpoint.settings.customHeaders) {
            for (const [key, value] of Object.entries(endpoint.settings.customHeaders)){
                response.headers.set(key, value);
            }
        }
        // Add CORS headers for easy frontend testing
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
    } catch (error) {
        console.error("Mock endpoint error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
async function GET(request, { params }) {
    const { slug } = await params;
    return handleMockRequest(request, slug, "GET");
}
async function POST(request, { params }) {
    const { slug } = await params;
    return handleMockRequest(request, slug, "POST");
}
async function PUT(request, { params }) {
    const { slug } = await params;
    return handleMockRequest(request, slug, "PUT");
}
async function PATCH(request, { params }) {
    const { slug } = await params;
    return handleMockRequest(request, slug, "PATCH");
}
async function DELETE(request, { params }) {
    const { slug } = await params;
    return handleMockRequest(request, slug, "DELETE");
}
async function OPTIONS() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__844772df._.js.map