# Volid

A browser-based code editor and project workspace — create projects, manage files in a nested folder tree, and get AI-powered inline code completions directly in the browser.

![Dark theme Monaco editor with file explorer sidebar](./public/preview.png)

---

# Features

- 📁 **Project & File Management**  
  Create projects, organize files and folders in a nested tree, rename, delete, and navigate with a VSCode-style sidebar.

- ✏️ **Monaco-powered Editor**  
  Powered by Monaco Editor — the same engine used in VS Code — with syntax highlighting, bracket colorization, auto-closing pairs, and a custom dark theme.

- 🤖 **AI Inline Completions**  
  Context-aware code completions powered by OpenRouter, Gemini, and the Vercel AI SDK.

- 🔐 **Authentication**  
  Sign in and sign up using Clerk. All projects and files are scoped to the authenticated user.

- 🌙 **Dark / Light Mode**  
  Persistent theme switching using `next-themes`.

- ⚡ **Real-time Persistence**  
  File content auto-saves with debounce using Convex real-time mutations.

- 🧠 **Background AI Jobs**  
  Inngest-powered background workflows for AI completions and async tasks.

- 🌐 **Project Importing**  
  Import projects and scrape content using Firecrawl.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| State Management | Zustand |
| Backend / Database | Convex |
| Authentication | Clerk + Convex JWT bridge |
| AI / LLM | Vercel AI SDK, Google Gemini, OpenRouter |
| Background Jobs | Inngest |
| Web Scraping | Firecrawl |
| Linting / Formatting | ESLint 9, Prettier |

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js >= 18
- pnpm (recommended)
- Convex account
- Clerk account
- OpenRouter API key
- Google AI API key
- Inngest account

---

## 1. Clone the Repository

```bash
git clone https://github.com/marsyg/Volid.git
cd Volid
```

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
CLERK_JWT_ISSUER_DOMAIN=<your-clerk-jwt-issuer-domain>

# AI Providers
OPENROUTER_API_KEY=<your-openrouter-api-key>
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-ai-api-key>
XAI_API_KEY=<your-xai-api-key> # optional

# Inngest
INNGEST_EVENT_KEY=<your-inngest-event-key>
INNGEST_SIGNING_KEY=<your-inngest-signing-key>
```

---

## 4. Deploy Convex Schema

```bash
npx convex dev
```

---

## 5. Start the Development Server

```bash
pnpm dev
```

Visit:

```txt
http://localhost:3000
```

> `INNGEST_DEV=1` is automatically enabled in development mode so Inngest runs locally without requiring a cloud connection.

---

# Project Structure

```txt
/
├── convex/                     # Convex backend schema, queries, mutations
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   ├── inline-completion/   # AI completion endpoint
│   │   │   └── inngest/             # Inngest webhook handler
│   │   └── projects/[projectId]/    # Project editor page
│   │
│   ├── components/             # Shared UI components
│   │
│   ├── features/
│   │   ├── auth/               # Authentication pages/views
│   │   ├── editor/             # Monaco editor + Zustand store
│   │   └── projects/           # Project explorer and layout
│   │
│   ├── inngest/                # Inngest client + background functions
│   └── lib/                    # Shared utilities and AI clients
│
└── public/                     # Static assets
```

---

# Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js + Inngest development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

# Contributing

Pull requests are welcome.

Before submitting changes, run:

```bash
pnpm lint
```

---

# License

Licensed under the MIT License.
