'use client';

import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  FolderTree, 
  RefreshCw, 
  Globe, 
  ArrowRight, 
  Lock, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Sparkles,
  ChevronRight,
  Eye,
  BookOpen
} from 'lucide-react';
import { ProjectView } from '@/features/projects/components/Project-view';

// Dynamic mock editor showing AI code autocompletion
function MockEditor() {
  const [code, setCode] = useState('// Auto-completing sum function...\nfunction calculateSum(a, b) {\n  ');
  const [suggestion, setSuggestion] = useState('');
  const [phase, setPhase] = useState(0); // 0: typing, 1: showing suggestion, 2: accepted suggestion, 3: completed, wait to reset

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 0) {
      setSuggestion('');
      const target = 'return a + b;';
      let currentTyped = '';
      let index = 0;
      timer = setInterval(() => {
        if (index < target.length) {
          currentTyped += target[index];
          setCode('// Auto-completing sum function...\nfunction calculateSum(a, b) {\n  ' + currentTyped);
          index++;
        } else {
          clearInterval(timer);
          setPhase(1);
        }
      }, 120);
    } else if (phase === 1) {
      // Show ghost text suggestion for closing brace
      setSuggestion('\n}');
      timer = setTimeout(() => {
        setPhase(2);
      }, 1200);
    } else if (phase === 2) {
      // Accept suggestion (append closing brace)
      setCode('// Auto-completing sum function...\nfunction calculateSum(a, b) {\n  return a + b;\n}');
      setSuggestion('');
      timer = setTimeout(() => {
        setPhase(3);
      }, 1500);
    } else if (phase === 3) {
      // Pause then restart
      timer = setTimeout(() => {
        setCode('// Auto-completing sum function...\nfunction calculateSum(a, b) {\n  ');
        setPhase(0);
      }, 4000);
    }
    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [phase]);

  return (
    <div className="w-full rounded-xl border border-border/40 bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-[13px] leading-relaxed">
      {/* OS window header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-xs text-neutral-500 font-sans font-medium select-none">
          sum.js — Volid Editor
        </div>
        <div className="w-12" /> {/* spacer */}
      </div>

      <div className="flex">
        {/* Editor Sidebar Mock */}
        <div className="hidden sm:flex flex-col items-center py-4 px-2 w-11 bg-muted/10 border-r border-border/20 text-neutral-600 gap-4">
          <Code2 size={18} className="text-primary/70" />
          <FolderTree size={18} />
          <Cpu size={18} />
          <Globe size={18} />
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-x-auto text-left relative min-h-[160px]">
          <div className="flex gap-4">
            {/* Line numbers */}
            <div className="select-none text-neutral-600 text-right pr-2 border-r border-border/10">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
            </div>
            
            {/* The actual code with suggestion overlay */}
            <div className="flex-1 whitespace-pre text-neutral-200">
              {code}
              {suggestion && (
                <span className="text-neutral-500 bg-neutral-800/40 rounded px-1 animate-pulse border-b border-neutral-600">
                  {suggestion} <span className="text-[10px] font-sans bg-neutral-700/80 text-neutral-300 px-1 py-0.5 rounded ml-1 font-semibold uppercase tracking-wider">Tab to Accept</span>
                </span>
              )}
              {/* blinking cursor */}
              <span className="inline-block w-1.5 h-4 bg-primary/80 ml-0.5 align-middle animate-pulse" />
            </div>
          </div>

          {/* Autocomplete micro-status toast */}
          {phase === 1 && (
            <div className="absolute bottom-4 right-4 bg-background/95 border border-primary/30 rounded-lg py-1.5 px-3 flex items-center gap-2 shadow-lg animate-in slide-in-from-bottom-2 duration-300">
              <Sparkles size={13} className="text-primary animate-pulse" />
              <span className="text-[11px] font-sans text-neutral-300">AI completion available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="font-mono text-sm text-neutral-400">Booting Volid...</span>
        </div>
      </div>
    );
  }

  // If logged in, show the main coding project manager dashboard
  if (isAuthenticated) {
    return <ProjectView />;
  }

  // If logged out, render the premium landing page
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden selection:bg-primary/30 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-mono text-2xl font-black tracking-wider bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              VOLID
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
              <a href="#stack" className="hover:text-white transition-colors">Tech Stack</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/sign-in" 
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-neutral-800/50"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-semibold px-4 py-2 rounded-lg shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />
          
          {/* Decorative Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono mb-6 animate-fade-in">
              <Sparkles size={12} />
              <span>Next-Gen Browser IDE with AI Autocomplete</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              Write Code. Build Projects. <br className="hidden sm:inline" />
              Powered by Inline AI.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Volid combines a powerful Monaco editor, real-time cloud autosaving, and context-aware AI completions in a clean, high-performance browser workspace.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                href="/sign-up" 
                className="group w-full sm:w-auto bg-white text-black hover:bg-neutral-200 font-semibold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
              >
                <span>Launch Your Workspace</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#demo" 
                className="w-full sm:w-auto border border-border/50 bg-muted/10 hover:bg-muted/30 font-medium px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Eye size={16} />
                <span>See How it Works</span>
              </a>
            </div>

            {/* Mock Editor Showcase */}
            <div id="demo" className="max-w-3xl mx-auto pt-6 scroll-mt-24">
              <MockEditor />
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="py-20 border-t border-border/30 bg-muted/5 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Built for modern developers</h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
                Everything you need to write and manage code projects from any browser, backed by a real-time database.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group border border-border/40 bg-card/40 hover:bg-card/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <FolderTree size={22} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Workspace File Explorer</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Manage multiple projects with a nested tree structure of folders and files. Create, rename, delete, and explore folders instantly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group border border-border/40 bg-card/40 hover:bg-card/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={22} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Monaco Editor Engine</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Enjoy the exact same coding experience as VS Code. Includes intelligent syntax highlighting, autocomplete, and theme configurations.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group border border-border/40 bg-card/40 hover:bg-card/80 p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Cpu size={22} />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Autocomplete</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Get context-aware suggestions as you type. Powered by high-speed models, providing inline code additions seamlessly in the cursor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Matrix Section */}
        <section id="stack" className="py-20 border-t border-border/30 scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Full Developer Tech Stack</h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
                Volid leverages modern architectures to guarantee lightning-fast load times and state persistence.
              </p>
            </div>

            <div className="max-w-3xl mx-auto border border-border/40 bg-card/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-2 border-b border-border/20 bg-muted/20 px-6 py-4 text-xs font-mono uppercase tracking-wider text-neutral-400">
                <div>Layer</div>
                <div>Technology</div>
              </div>
              <div className="divide-y divide-border/10 font-sans text-sm">
                <div className="grid grid-cols-2 px-6 py-4 hover:bg-muted/10 transition-colors">
                  <div className="font-semibold text-neutral-200">Framework</div>
                  <div className="text-neutral-400 font-mono">Next.js 16 + React 19</div>
                </div>
                <div className="grid grid-cols-2 px-6 py-4 hover:bg-muted/10 transition-colors">
                  <div className="font-semibold text-neutral-200">State & Realtime</div>
                  <div className="text-neutral-400 font-mono">Convex Live Database</div>
                </div>
                <div className="grid grid-cols-2 px-6 py-4 hover:bg-muted/10 transition-colors">
                  <div className="font-semibold text-neutral-200">Auth Bridging</div>
                  <div className="text-neutral-400 font-mono">Clerk JWT integration</div>
                </div>
                <div className="grid grid-cols-2 px-6 py-4 hover:bg-muted/10 transition-colors">
                  <div className="font-semibold text-neutral-200">Background Workflows</div>
                  <div className="text-neutral-400 font-mono">Inngest Engine</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 border-t border-border/30 bg-gradient-to-b from-transparent to-muted/20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">Ready to boost your workflow?</h2>
            <p className="text-neutral-400 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Create your account in seconds, and import your project files to edit them directly in the cloud.
            </p>
            <Link 
              href="/sign-up" 
              className="bg-white text-black hover:bg-neutral-200 font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <span>Get Started for Free</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-xs font-mono gap-4">
          <div>© {new Date().getFullYear()} Volid IDE. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="hover:text-neutral-300 transition-colors">OpenRouter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
