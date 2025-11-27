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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

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
"[project]/src/lib/generator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateContextAwareData",
    ()=>generateContextAwareData,
    "generateSchema",
    ()=>generateSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__ = __turbopack_context__.i("[project]/node_modules/@faker-js/faker/dist/chunk-3WUZ46N3.js [app-route] (ecmascript) <export a as faker>");
;
function generateContextAwareData(prompt) {
    const parsed = parsePrompt(prompt);
    if (parsed.isArray) {
        return Array.from({
            length: parsed.count
        }, (_, index)=>generateSingleItem(parsed.fields, index));
    }
    return generateSingleItem(parsed.fields, 0);
}
function parsePrompt(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    // Detect count
    const countMatch = lowerPrompt.match(/(\d+)\s*(items?|products?|users?|entries?|records?|results?|sneakers?|shoes?|posts?|comments?|orders?)/);
    const count = countMatch ? parseInt(countMatch[1]) : 10;
    // Detect if it's an array/list
    const isArray = /list|array|multiple|\d+\s*\w+|all|collection/i.test(prompt);
    // Extract entity name
    const entityPatterns = [
        /(?:list of|array of|collection of)\s+(\w+)/i,
        /(\w+)\s+(?:api|endpoint|data|mock)/i,
        /for\s+(?:a\s+)?(\w+)/i
    ];
    let name = "items";
    for (const pattern of entityPatterns){
        const match = prompt.match(pattern);
        if (match) {
            name = match[1].toLowerCase();
            break;
        }
    }
    // Detect fields from prompt
    const fields = detectFields(prompt);
    return {
        name,
        count,
        fields,
        isArray: isArray || count > 1
    };
}
function detectFields(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const fields = {};
    // Common field patterns and their generators
    const fieldDetectors = [
        // IDs
        {
            patterns: [
                /\bid\b/,
                /\bidentifier\b/
            ],
            fieldName: "id",
            type: "id"
        },
        // Names
        {
            patterns: [
                /\bname\b/,
                /\btitle\b/
            ],
            fieldName: "name",
            type: "name"
        },
        {
            patterns: [
                /\bfirst\s*name\b/
            ],
            fieldName: "firstName",
            type: "firstName"
        },
        {
            patterns: [
                /\blast\s*name\b/
            ],
            fieldName: "lastName",
            type: "lastName"
        },
        {
            patterns: [
                /\busername\b/
            ],
            fieldName: "username",
            type: "username"
        },
        // Contact
        {
            patterns: [
                /\bemail\b/
            ],
            fieldName: "email",
            type: "email"
        },
        {
            patterns: [
                /\bphone\b/,
                /\bmobile\b/
            ],
            fieldName: "phone",
            type: "phone"
        },
        {
            patterns: [
                /\baddress\b/
            ],
            fieldName: "address",
            type: "address"
        },
        // Commerce
        {
            patterns: [
                /\bprice\b/,
                /\bcost\b/,
                /\bamount\b/
            ],
            fieldName: "price",
            type: "price"
        },
        {
            patterns: [
                /\bdescription\b/,
                /\bdesc\b/
            ],
            fieldName: "description",
            type: "description"
        },
        {
            patterns: [
                /\bcategory\b/
            ],
            fieldName: "category",
            type: "category"
        },
        {
            patterns: [
                /\bbrand\b/
            ],
            fieldName: "brand",
            type: "brand"
        },
        {
            patterns: [
                /\brating\b/,
                /\bscore\b/
            ],
            fieldName: "rating",
            type: "rating"
        },
        {
            patterns: [
                /\bstock\b/,
                /\bquantity\b/,
                /\bavailable\b/
            ],
            fieldName: "stock",
            type: "stock"
        },
        {
            patterns: [
                /\bsku\b/
            ],
            fieldName: "sku",
            type: "sku"
        },
        // Appearance
        {
            patterns: [
                /\bcolor\b/,
                /\bcolour\b/
            ],
            fieldName: "color",
            type: "color"
        },
        {
            patterns: [
                /\bsize\b/
            ],
            fieldName: "size",
            type: "size"
        },
        {
            patterns: [
                /\bimage\b/,
                /\bphoto\b/,
                /\bpicture\b/,
                /\bthumbnail\b/
            ],
            fieldName: "imageUrl",
            type: "imageUrl"
        },
        {
            patterns: [
                /\bimage\s*url\b/,
                /\bphoto\s*url\b/
            ],
            fieldName: "imageUrl",
            type: "imageUrl"
        },
        // URLs and Links
        {
            patterns: [
                /\burl\b/,
                /\blink\b/,
                /\bwebsite\b/
            ],
            fieldName: "url",
            type: "url"
        },
        // Dates
        {
            patterns: [
                /\bdate\b/,
                /\bcreated\b/
            ],
            fieldName: "createdAt",
            type: "date"
        },
        {
            patterns: [
                /\bupdated\b/
            ],
            fieldName: "updatedAt",
            type: "date"
        },
        // Boolean flags
        {
            patterns: [
                /\bactive\b/,
                /\benabled\b/
            ],
            fieldName: "isActive",
            type: "boolean"
        },
        {
            patterns: [
                /\bavailable\b/,
                /\bin\s*stock\b/
            ],
            fieldName: "isAvailable",
            type: "boolean"
        },
        // User related
        {
            patterns: [
                /\bpassword\b/
            ],
            fieldName: "password",
            type: "password"
        },
        {
            patterns: [
                /\bavatar\b/,
                /\bprofile\s*pic/
            ],
            fieldName: "avatar",
            type: "avatar"
        },
        {
            patterns: [
                /\bbio\b/,
                /\babout\b/
            ],
            fieldName: "bio",
            type: "bio"
        },
        {
            patterns: [
                /\bage\b/
            ],
            fieldName: "age",
            type: "age"
        },
        {
            patterns: [
                /\bgender\b/
            ],
            fieldName: "gender",
            type: "gender"
        },
        // Location
        {
            patterns: [
                /\bcity\b/
            ],
            fieldName: "city",
            type: "city"
        },
        {
            patterns: [
                /\bcountry\b/
            ],
            fieldName: "country",
            type: "country"
        },
        {
            patterns: [
                /\bzip\b/,
                /\bpostal\b/
            ],
            fieldName: "zipCode",
            type: "zipCode"
        },
        {
            patterns: [
                /\blat(?:itude)?\b/
            ],
            fieldName: "latitude",
            type: "latitude"
        },
        {
            patterns: [
                /\blong(?:itude)?\b/
            ],
            fieldName: "longitude",
            type: "longitude"
        },
        // Content
        {
            patterns: [
                /\bcontent\b/,
                /\bbody\b/,
                /\btext\b/
            ],
            fieldName: "content",
            type: "content"
        },
        {
            patterns: [
                /\bcomment\b/
            ],
            fieldName: "comment",
            type: "comment"
        },
        {
            patterns: [
                /\btag\b/
            ],
            fieldName: "tags",
            type: "tags"
        }
    ];
    // Always add an ID
    fields["id"] = {
        type: "id"
    };
    for (const detector of fieldDetectors){
        for (const pattern of detector.patterns){
            if (pattern.test(lowerPrompt)) {
                fields[detector.fieldName] = {
                    type: detector.type
                };
                break;
            }
        }
    }
    // Context-aware field additions based on entity type
    const entityContextFields = getEntityContextFields(lowerPrompt);
    for (const [fieldName, fieldType] of Object.entries(entityContextFields)){
        if (!fields[fieldName]) {
            fields[fieldName] = {
                type: fieldType
            };
        }
    }
    return fields;
}
function getEntityContextFields(prompt) {
    // Add sensible defaults based on detected entity type
    if (/sneaker|shoe|footwear/i.test(prompt)) {
        return {
            name: "productName",
            brand: "brand",
            price: "price",
            color: "color",
            size: "shoeSize",
            imageUrl: "imageUrl",
            description: "description",
            rating: "rating",
            inStock: "boolean"
        };
    }
    if (/user|person|member|customer/i.test(prompt)) {
        return {
            firstName: "firstName",
            lastName: "lastName",
            email: "email",
            avatar: "avatar",
            createdAt: "date"
        };
    }
    if (/product|item|merchandise/i.test(prompt)) {
        return {
            name: "productName",
            price: "price",
            description: "description",
            category: "category",
            imageUrl: "imageUrl",
            rating: "rating"
        };
    }
    if (/post|article|blog/i.test(prompt)) {
        return {
            title: "title",
            content: "content",
            author: "name",
            createdAt: "date",
            tags: "tags"
        };
    }
    if (/order|purchase|transaction/i.test(prompt)) {
        return {
            orderNumber: "orderNumber",
            total: "price",
            status: "orderStatus",
            createdAt: "date",
            customerName: "name"
        };
    }
    if (/comment|review|feedback/i.test(prompt)) {
        return {
            author: "name",
            content: "comment",
            rating: "rating",
            createdAt: "date"
        };
    }
    return {};
}
function generateSingleItem(fields, index) {
    const item = {};
    for (const [fieldName, field] of Object.entries(fields)){
        item[fieldName] = generateFieldValue(field.type, index);
    }
    return item;
}
function generateFieldValue(type, index) {
    switch(type){
        // IDs
        case "id":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].string.uuid();
        // Names
        case "name":
        case "productName":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].commerce.productName();
        case "firstName":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].person.firstName();
        case "lastName":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].person.lastName();
        case "username":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].internet.username();
        case "title":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].lorem.sentence({
                min: 3,
                max: 8
            });
        // Contact
        case "email":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].internet.email();
        case "phone":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].phone.number();
        case "address":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].location.streetAddress({
                useFullAddress: true
            });
        // Commerce
        case "price":
            return parseFloat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].commerce.price({
                min: 10,
                max: 500,
                dec: 2
            }));
        case "description":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].commerce.productDescription();
        case "category":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].commerce.department();
        case "brand":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].company.name();
        case "rating":
            return parseFloat((Math.random() * 4 + 1).toFixed(1)); // 1.0 to 5.0
        case "stock":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].number.int({
                min: 0,
                max: 1000
            });
        case "sku":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].string.alphanumeric({
                length: 8,
                casing: "upper"
            });
        // Appearance
        case "color":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].color.human();
        case "size":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].helpers.arrayElement([
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "XXL"
            ]);
        case "shoeSize":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].helpers.arrayElement([
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13
            ]);
        case "imageUrl":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].image.url({
                width: 640,
                height: 480
            });
        // URLs
        case "url":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].internet.url();
        case "avatar":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].image.avatar();
        // Dates
        case "date":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].date.recent({
                days: 30
            }).toISOString();
        // Boolean
        case "boolean":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].datatype.boolean();
        // User related
        case "password":
            return "********"; // Don't generate real passwords
        case "bio":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].person.bio();
        case "age":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].number.int({
                min: 18,
                max: 80
            });
        case "gender":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].person.sex();
        // Location
        case "city":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].location.city();
        case "country":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].location.country();
        case "zipCode":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].location.zipCode();
        case "latitude":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].location.latitude();
        case "longitude":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].location.longitude();
        // Content
        case "content":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].lorem.paragraphs({
                min: 1,
                max: 3
            });
        case "comment":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].lorem.sentence({
                min: 5,
                max: 15
            });
        case "tags":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].helpers.arrayElements([
                "tech",
                "lifestyle",
                "news",
                "sports",
                "entertainment",
                "business",
                "health"
            ], {
                min: 1,
                max: 4
            });
        // Order related
        case "orderNumber":
            return `ORD-${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].string.alphanumeric({
                length: 8,
                casing: "upper"
            })}`;
        case "orderStatus":
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].helpers.arrayElement([
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ]);
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$faker$2d$js$2f$faker$2f$dist$2f$chunk$2d$3WUZ46N3$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__a__as__faker$3e$__["faker"].lorem.word();
    }
}
function generateSchema(data) {
    if (Array.isArray(data)) {
        if (data.length === 0) {
            return {
                type: "array",
                items: {}
            };
        }
        return {
            type: "array",
            items: generateSchema(data[0])
        };
    }
    if (typeof data === "object" && data !== null) {
        const properties = {};
        for (const [key, value] of Object.entries(data)){
            properties[key] = generateSchema(value);
        }
        return {
            type: "object",
            properties
        };
    }
    if (typeof data === "number") {
        return {
            type: Number.isInteger(data) ? "integer" : "number"
        };
    }
    if (typeof data === "boolean") {
        return {
            type: "boolean"
        };
    }
    if (typeof data === "string") {
        return {
            type: "string"
        };
    }
    return {
        type: "null"
    };
}
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
"[project]/src/app/api/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v4.js [app-route] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/types.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function generateWithGemini(prompt, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: `You are a mock data generator. Generate realistic JSON mock data based on this request: "${prompt}"

IMPORTANT: Return ONLY valid JSON data, no markdown, no code blocks, no explanation. Just the raw JSON.

The data should be realistic and contextually appropriate. If the request mentions a number of items, generate that many. Include relevant fields based on the context.

Example: If asked for "5 users with name and email", return:
[{"id":1,"name":"John Smith","email":"john.smith@email.com"},{"id":2,"name":"Jane Doe","email":"jane.doe@email.com"},...]

Generate the mock data now:`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192
            }
        })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate with Gemini");
    }
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error("No response from Gemini");
    }
    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();
    return JSON.parse(cleanedText);
}
async function POST(request) {
    try {
        const body = await request.json();
        const { prompt, apiKey } = body;
        if (!prompt || typeof prompt !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Prompt is required"
            }, {
                status: 400
            });
        }
        // Generate mock data - use Gemini if API key provided, otherwise use local generator
        let data;
        if (apiKey) {
            try {
                data = await generateWithGemini(prompt, apiKey);
            } catch (error) {
                console.error("Gemini API error:", error);
                // Fallback to local generator if Gemini fails
                data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateContextAwareData"])(prompt);
            }
        } else {
            data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateContextAwareData"])(prompt);
        }
        const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSchema"])(data);
        // Create the endpoint
        const endpoint = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v4$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            slug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateEndpointSlug"])(prompt),
            name: extractEndpointName(prompt),
            prompt,
            schema,
            data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SETTINGS"]
            }
        };
        // Save to storage
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockStorage"].create(endpoint);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            endpoint
        });
    } catch (error) {
        console.error("Generate error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to generate mock data"
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        const endpoints = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockStorage"].getAll();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            endpoints
        });
    } catch (error) {
        console.error("Get endpoints error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to fetch endpoints"
        }, {
            status: 500
        });
    }
}
function extractEndpointName(prompt) {
    // Extract a meaningful name from the prompt
    const words = prompt.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/).filter((word)=>word.length > 2).slice(0, 4);
    return words.map((w)=>w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc85b471._.js.map