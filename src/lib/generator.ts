import { faker } from "@faker-js/faker";

interface SchemaField {
  type: string;
  example?: unknown;
}

interface ParsedSchema {
  name: string;
  count: number;
  fields: Record<string, SchemaField>;
  isArray: boolean;
}

// Smart context-aware data generator
export function generateContextAwareData(prompt: string): unknown {
  const parsed = parsePrompt(prompt);
  
  if (parsed.isArray) {
    return Array.from({ length: parsed.count }, (_, index) => 
      generateSingleItem(parsed.fields, index)
    );
  }
  
  return generateSingleItem(parsed.fields, 0);
}

function parsePrompt(prompt: string): ParsedSchema {
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
    /for\s+(?:a\s+)?(\w+)/i,
  ];
  
  let name = "items";
  for (const pattern of entityPatterns) {
    const match = prompt.match(pattern);
    if (match) {
      name = match[1].toLowerCase();
      break;
    }
  }
  
  // Detect fields from prompt
  const fields = detectFields(prompt);
  
  return { name, count, fields, isArray: isArray || count > 1 };
}

function detectFields(prompt: string): Record<string, SchemaField> {
  const lowerPrompt = prompt.toLowerCase();
  const fields: Record<string, SchemaField> = {};
  
  // Common field patterns and their generators
  const fieldDetectors: Array<{
    patterns: RegExp[];
    fieldName: string;
    type: string;
  }> = [
    // IDs
    { patterns: [/\bid\b/, /\bidentifier\b/], fieldName: "id", type: "id" },
    
    // Names
    { patterns: [/\bname\b/, /\btitle\b/], fieldName: "name", type: "name" },
    { patterns: [/\bfirst\s*name\b/], fieldName: "firstName", type: "firstName" },
    { patterns: [/\blast\s*name\b/], fieldName: "lastName", type: "lastName" },
    { patterns: [/\busername\b/], fieldName: "username", type: "username" },
    
    // Contact
    { patterns: [/\bemail\b/], fieldName: "email", type: "email" },
    { patterns: [/\bphone\b/, /\bmobile\b/], fieldName: "phone", type: "phone" },
    { patterns: [/\baddress\b/], fieldName: "address", type: "address" },
    
    // Commerce
    { patterns: [/\bprice\b/, /\bcost\b/, /\bamount\b/], fieldName: "price", type: "price" },
    { patterns: [/\bdescription\b/, /\bdesc\b/], fieldName: "description", type: "description" },
    { patterns: [/\bcategory\b/], fieldName: "category", type: "category" },
    { patterns: [/\bbrand\b/], fieldName: "brand", type: "brand" },
    { patterns: [/\brating\b/, /\bscore\b/], fieldName: "rating", type: "rating" },
    { patterns: [/\bstock\b/, /\bquantity\b/, /\bavailable\b/], fieldName: "stock", type: "stock" },
    { patterns: [/\bsku\b/], fieldName: "sku", type: "sku" },
    
    // Appearance
    { patterns: [/\bcolor\b/, /\bcolour\b/], fieldName: "color", type: "color" },
    { patterns: [/\bsize\b/], fieldName: "size", type: "size" },
    { patterns: [/\bimage\b/, /\bphoto\b/, /\bpicture\b/, /\bthumbnail\b/], fieldName: "imageUrl", type: "imageUrl" },
    { patterns: [/\bimage\s*url\b/, /\bphoto\s*url\b/], fieldName: "imageUrl", type: "imageUrl" },
    
    // URLs and Links
    { patterns: [/\burl\b/, /\blink\b/, /\bwebsite\b/], fieldName: "url", type: "url" },
    
    // Dates
    { patterns: [/\bdate\b/, /\bcreated\b/], fieldName: "createdAt", type: "date" },
    { patterns: [/\bupdated\b/], fieldName: "updatedAt", type: "date" },
    
    // Boolean flags
    { patterns: [/\bactive\b/, /\benabled\b/], fieldName: "isActive", type: "boolean" },
    { patterns: [/\bavailable\b/, /\bin\s*stock\b/], fieldName: "isAvailable", type: "boolean" },
    
    // User related
    { patterns: [/\bpassword\b/], fieldName: "password", type: "password" },
    { patterns: [/\bavatar\b/, /\bprofile\s*pic/], fieldName: "avatar", type: "avatar" },
    { patterns: [/\bbio\b/, /\babout\b/], fieldName: "bio", type: "bio" },
    { patterns: [/\bage\b/], fieldName: "age", type: "age" },
    { patterns: [/\bgender\b/], fieldName: "gender", type: "gender" },
    
    // Location
    { patterns: [/\bcity\b/], fieldName: "city", type: "city" },
    { patterns: [/\bcountry\b/], fieldName: "country", type: "country" },
    { patterns: [/\bzip\b/, /\bpostal\b/], fieldName: "zipCode", type: "zipCode" },
    { patterns: [/\blat(?:itude)?\b/], fieldName: "latitude", type: "latitude" },
    { patterns: [/\blong(?:itude)?\b/], fieldName: "longitude", type: "longitude" },
    
    // Content
    { patterns: [/\bcontent\b/, /\bbody\b/, /\btext\b/], fieldName: "content", type: "content" },
    { patterns: [/\bcomment\b/], fieldName: "comment", type: "comment" },
    { patterns: [/\btag\b/], fieldName: "tags", type: "tags" },
  ];
  
  // Always add an ID
  fields["id"] = { type: "id" };
  
  for (const detector of fieldDetectors) {
    for (const pattern of detector.patterns) {
      if (pattern.test(lowerPrompt)) {
        fields[detector.fieldName] = { type: detector.type };
        break;
      }
    }
  }
  
  // Context-aware field additions based on entity type
  const entityContextFields = getEntityContextFields(lowerPrompt);
  for (const [fieldName, fieldType] of Object.entries(entityContextFields)) {
    if (!fields[fieldName]) {
      fields[fieldName] = { type: fieldType };
    }
  }
  
  return fields;
}

function getEntityContextFields(prompt: string): Record<string, string> {
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
      inStock: "boolean",
    };
  }
  
  if (/user|person|member|customer/i.test(prompt)) {
    return {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      avatar: "avatar",
      createdAt: "date",
    };
  }
  
  if (/product|item|merchandise/i.test(prompt)) {
    return {
      name: "productName",
      price: "price",
      description: "description",
      category: "category",
      imageUrl: "imageUrl",
      rating: "rating",
    };
  }
  
  if (/post|article|blog/i.test(prompt)) {
    return {
      title: "title",
      content: "content",
      author: "name",
      createdAt: "date",
      tags: "tags",
    };
  }
  
  if (/order|purchase|transaction/i.test(prompt)) {
    return {
      orderNumber: "orderNumber",
      total: "price",
      status: "orderStatus",
      createdAt: "date",
      customerName: "name",
    };
  }
  
  if (/comment|review|feedback/i.test(prompt)) {
    return {
      author: "name",
      content: "comment",
      rating: "rating",
      createdAt: "date",
    };
  }
  
  return {};
}

function generateSingleItem(fields: Record<string, SchemaField>, index: number): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  
  for (const [fieldName, field] of Object.entries(fields)) {
    item[fieldName] = generateFieldValue(field.type, index);
  }
  
  return item;
}

function generateFieldValue(type: string, index: number): unknown {
  switch (type) {
    // IDs
    case "id":
      return faker.string.uuid();
    
    // Names
    case "name":
    case "productName":
      return faker.commerce.productName();
    case "firstName":
      return faker.person.firstName();
    case "lastName":
      return faker.person.lastName();
    case "username":
      return faker.internet.username();
    case "title":
      return faker.lorem.sentence({ min: 3, max: 8 });
    
    // Contact
    case "email":
      return faker.internet.email();
    case "phone":
      return faker.phone.number();
    case "address":
      return faker.location.streetAddress({ useFullAddress: true });
    
    // Commerce
    case "price":
      return parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 }));
    case "description":
      return faker.commerce.productDescription();
    case "category":
      return faker.commerce.department();
    case "brand":
      return faker.company.name();
    case "rating":
      return parseFloat((Math.random() * 4 + 1).toFixed(1)); // 1.0 to 5.0
    case "stock":
      return faker.number.int({ min: 0, max: 1000 });
    case "sku":
      return faker.string.alphanumeric({ length: 8, casing: "upper" });
    
    // Appearance
    case "color":
      return faker.color.human();
    case "size":
      return faker.helpers.arrayElement(["XS", "S", "M", "L", "XL", "XXL"]);
    case "shoeSize":
      return faker.helpers.arrayElement([6, 7, 8, 9, 10, 11, 12, 13]);
    case "imageUrl":
      return faker.image.url({ width: 640, height: 480 });
    
    // URLs
    case "url":
      return faker.internet.url();
    case "avatar":
      return faker.image.avatar();
    
    // Dates
    case "date":
      return faker.date.recent({ days: 30 }).toISOString();
    
    // Boolean
    case "boolean":
      return faker.datatype.boolean();
    
    // User related
    case "password":
      return "********"; // Don't generate real passwords
    case "bio":
      return faker.person.bio();
    case "age":
      return faker.number.int({ min: 18, max: 80 });
    case "gender":
      return faker.person.sex();
    
    // Location
    case "city":
      return faker.location.city();
    case "country":
      return faker.location.country();
    case "zipCode":
      return faker.location.zipCode();
    case "latitude":
      return faker.location.latitude();
    case "longitude":
      return faker.location.longitude();
    
    // Content
    case "content":
      return faker.lorem.paragraphs({ min: 1, max: 3 });
    case "comment":
      return faker.lorem.sentence({ min: 5, max: 15 });
    case "tags":
      return faker.helpers.arrayElements(
        ["tech", "lifestyle", "news", "sports", "entertainment", "business", "health"],
        { min: 1, max: 4 }
      );
    
    // Order related
    case "orderNumber":
      return `ORD-${faker.string.alphanumeric({ length: 8, casing: "upper" })}`;
    case "orderStatus":
      return faker.helpers.arrayElement(["pending", "processing", "shipped", "delivered", "cancelled"]);
    
    default:
      return faker.lorem.word();
  }
}

// Generate JSON schema from the data
export function generateSchema(data: unknown): Record<string, unknown> {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { type: "array", items: {} };
    }
    return {
      type: "array",
      items: generateSchema(data[0]),
    };
  }
  
  if (typeof data === "object" && data !== null) {
    const properties: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      properties[key] = generateSchema(value);
    }
    return {
      type: "object",
      properties,
    };
  }
  
  if (typeof data === "number") {
    return { type: Number.isInteger(data) ? "integer" : "number" };
  }
  
  if (typeof data === "boolean") {
    return { type: "boolean" };
  }
  
  if (typeof data === "string") {
    return { type: "string" };
  }
  
  return { type: "null" };
}
