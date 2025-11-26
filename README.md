# Smart AI API Mocking Tool

A powerful, AI-powered mock API generator that allows developers to create realistic test endpoints using plain English prompts. Built for the Overclock hackathon.

## 🚀 Features

### Phase 1: Core MVP Features

#### 1. Prompt-to-Schema Input
- Simple text input where users describe their API needs in plain English
- Example: "I need an API for a list of 10 customized sneakers with price, color, size, and image URL"

#### 2. AI-Powered Generator (Context-Aware)
- Generates JSON data based on natural language descriptions
- **Smart data generation**: 
  - Prices get realistic numbers (e.g., `120.50`)
  - Colors get actual color names (e.g., `"Red"`, `"Blue"`)
  - Emails get proper email formats
  - And 40+ other context-aware field types

#### 3. Live Endpoints
- Instantly generates unique URLs for each mock API
- Example: `https://your-app.com/api/mock/sneakers-mock-abc123`
- Ready to use in your frontend code immediately

#### 4. JSON Editor
- View and edit AI-generated data
- Syntax-highlighted editor
- Real-time validation
- Copy to clipboard functionality

### Phase 2: Chaos Mode & Dynamic Routing

#### 1. Chaos Mode
Simulate real-world server conditions:

**Latency Simulation:**
- Add custom delays (0-5000ms)
- Test loading spinners and loading states
- Slider control for easy adjustment

**Error Rate Simulation:**
- Configure failure percentage (0-100%)
- Choose error type:
  - 500 Internal Server Error
  - 503 Service Unavailable
  - 404 Not Found
  - 408 Request Timeout
- Test your error handling code

**Quick Presets:**
- Perfect Server (0ms, 0% errors)
- Slow Network (2000ms delay)
- Flaky Server (500ms, 10% errors)
- Total Chaos (3000ms, 30% errors)

#### 2. Dynamic Routing (CRUD Simulator)
Full HTTP method support:

| Method | Behavior |
|--------|----------|
| `GET` | Returns the mock data |
| `POST` | Simulates resource creation with auto-generated ID |
| `PUT` | Simulates full resource replacement |
| `PATCH` | Simulates partial resource update |
| `DELETE` | Simulates resource deletion |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Generation**: Faker.js
- **Icons**: Lucide React

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

### Creating a Mock API

1. **Describe your API** in the text input:
   ```
   I need an API for 10 customized sneakers with price, color, size, and image URL
   ```

2. **Press Enter** or click the send button

3. **Get your endpoint URL** instantly:
   ```
   http://localhost:3000/api/mock/sneakers-xyz123
   ```

4. **Edit the JSON** if needed in the editor panel

5. **Configure Chaos Mode** to test edge cases

## API Endpoints

### Generate Mock API
```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "I need an API for 5 users with name, email, and avatar"
}
```

### Mock Endpoint (Dynamic)
```http
GET    /api/mock/:slug    # Returns mock data
POST   /api/mock/:slug    # Simulates create
PUT    /api/mock/:slug    # Simulates replace
PATCH  /api/mock/:slug    # Simulates update
DELETE /api/mock/:slug    # Simulates delete
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/         # Mock generation endpoint
│   │   ├── endpoints/[id]/   # CRUD for saved endpoints
│   │   └── mock/[slug]/      # Dynamic mock endpoints
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── PromptInput.tsx       # Main input component
│   ├── JsonEditor.tsx        # JSON editor with syntax highlighting
│   ├── EndpointList.tsx      # List of created endpoints
│   ├── ChaosMode.tsx         # Chaos mode controls
│   └── ApiTester.tsx         # Built-in API tester
└── lib/
    ├── generator.ts          # AI-powered data generator
    ├── storage.ts            # In-memory storage
    ├── store.ts              # Zustand state management
    ├── types.ts              # TypeScript definitions
    └── utils.ts              # Utility functions
```

## Supported Data Types

The AI generator automatically detects and generates appropriate data for:

| Category | Fields |
|----------|--------|
| **Identity** | id, name, firstName, lastName, username |
| **Contact** | email, phone, address |
| **Commerce** | price, description, category, brand, rating, stock, sku |
| **Appearance** | color, size, imageUrl |
| **Location** | city, country, zipCode, latitude, longitude |
| **Content** | title, content, comment, bio, tags |
| **Dates** | createdAt, updatedAt |
| **Booleans** | isActive, isAvailable |

## Hackathon

Built for the **Overclock Hackathon** - Problem Statement #5: Smart AI API Mocking Tool

---

**Made with ⚡ for developers who move fast**
