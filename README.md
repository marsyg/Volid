Volid
A browser-based code editor and project workspace — create projects, manage files in a nested folder tree, and get AI-powered inline code completions, all in the browser.

![Dark theme Monaco editor with file explorer sidebar]

Features
📁 Project & file management — create projects, organize files and folders in a nested tree, rename, delete, and navigate with a VSCode-style sidebar
✏️ Monaco-powered editor — the same engine that powers VS Code, with syntax highlighting for 20+ languages, bracket colorization, auto-closing pairs, and a custom dark theme
🤖 AI inline completions — context-aware completions at the cursor powered by OpenRouter (GPT) and Google Gemini, delivered via Inngest background functions
🔐 Authentication — sign-in / sign-up via Clerk; all data is scoped to the authenticated user
🌙 Dark / light mode — persistent theme preference with next-themes
⚡ Real-time persistence — file content auto-saves with debounce to Convex, a real-time database
Tech Stack
Layer	Technology
Framework	Next.js 16 (App Router), React 19
Language	TypeScript 5 (strict)
Styling	Tailwind CSS v4, shadcn/ui, Radix UI
Editor	Monaco Editor (@monaco-editor/react)
State	Zustand (tab/editor state)
Database / Backend	Convex (real-time BaaS, queries & mutations)
Auth	Clerk + Convex JWT bridge
AI / LLM	Vercel AI SDK, Google Gemini 2.5 Flash, OpenRouter
Background jobs	Inngest
Web scraping	Firecrawl (project import)
Linting / Formatting	ESLint 9 (Next.js config), Prettier
Getting Started
Prerequisites
Node.js ≥ 18
pnpm (or npm / yarn)
A Convex account
A Clerk account
An OpenRouter API key
A Google AI API key (Gemini)
An Inngest account (for background AI functions)
1. Clone & install
bash
git clone https://github.com/marsyg/Volid.git
cd Volid
pnpm install
2. Set up environment variables
Create a .env.local file at the project root:

env
# Convex
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
CLERK_JWT_ISSUER_DOMAIN=<your-clerk-jwt-issuer-domain>

# AI
OPENROUTER_API_KEY=<your-openrouter-api-key>
GOOGLE_GENERATIVE_AI_API_KEY=<your-google-ai-api-key>
XAI_API_KEY=<your-xai-api-key>   # optional
3. Deploy Convex schema
bash
npx convex dev
4. Run the development server
bash
pnpm dev
Open http://localhost:3000.

Note: INNGEST_DEV=1 is set automatically in the dev script so Inngest runs locally without a cloud connection.

Project Structure
Code
/
├── convex/              # Backend: Convex schema, queries, mutations (projects, files, auth)
├── src/
│   ├── app/             # Next.js App Router pages + API routes
│   │   ├── api/
│   │   │   ├── inline-completion/   # REST endpoint for Monaco inline completions
│   │   │   └── inngest/             # Inngest webhook handler
│   │   └── projects/[projectId]/    # Per-project editor page
│   ├── components/      # Global UI components (shadcn/ui primitives, providers)
│   ├── features/
│   │   ├── auth/        # Unauthenticated landing view
│   │   ├── editor/      # Monaco editor, tab bar, Zustand store
│   │   └── projects/    # Project list, file explorer tree, project layout
│   ├── inngest/         # Inngest client + background AI functions
│   └── lib/             # OpenRouter client, shared utilities
└── public/              # Static assets
Scripts
Command	Description
pnpm dev	Start Next.js + Inngest dev server
pnpm build	Production build
pnpm start	Start production server
pnpm lint	Run ESLint
Contributing
Pull requests are welcome. Please run pnpm lint before submitting.

License
MIT
