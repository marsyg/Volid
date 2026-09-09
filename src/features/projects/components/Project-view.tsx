'use client';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';
import { FolderGit2Icon, PlusIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import { Poppins } from 'next/font/google';
import { FaGithub } from 'react-icons/fa';
import { useCreateProjects } from '../hooks/use-projects';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
  colors,
} from 'unique-names-generator';
import { ProjectList } from './project-list';
import { ProjectCommandDialog } from './projects-command-dialog';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const ProjectView = () => {
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const createProject = useCreateProjects();

  const handleCreateNewProject = () => {
    const projectName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      separator: '-',
      length: 3,
    });
    createProject({
      name: projectName,
    });
  };

  // Keyboard shortcuts for dashboard: J (New), I (Import), ⌘K (Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandDialogOpen((prev) => !prev);
      } else if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key.toLowerCase() === 'j') {
          e.preventDefault();
          handleCreateNewProject();
        } else if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ProjectCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />
      <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden select-none">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 items-stretch">
          {/* Header & Branding */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/60 text-xs font-medium text-muted-foreground shadow-xs">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Volid In-Browser Cloud IDE</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-xl bg-secondary/50 border border-border/80 shadow-sm">
                <Image src="/vercel.svg" alt="Volid Logo" width={28} height={28} className="dark:invert" />
              </div>
              <h1
                className={cn(
                  'text-4xl md:text-5xl font-bold tracking-tight text-foreground',
                  font.className,
                )}
              >
                Volid
              </h1>
            </div>

            <p className="text-sm text-muted-foreground max-w-md">
              Create, edit, and run complete web applications directly in your browser with AI assistance and WebContainers.
            </p>
          </div>

          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setCommandDialogOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-secondary/40 border border-border/70 hover:border-primary/40 hover:bg-secondary/70 text-muted-foreground text-sm transition-all duration-200 shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <SearchIcon className="size-4 group-hover:text-foreground transition-colors" />
              <span className="group-hover:text-foreground transition-colors">Search or jump to project...</span>
            </div>
            <div className="flex items-center gap-1">
              <Kbd className="bg-background/80 border text-[11px] px-1.5 py-0.5">⌘K</Kbd>
            </div>
          </button>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={handleCreateNewProject}
              className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <PlusIcon className="size-5" />
                </div>
                <Kbd className="bg-secondary/80 border text-xs px-2 py-0.5 group-hover:border-primary/30 transition-colors">
                  J
                </Kbd>
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  New Project
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Generate a clean project workspace with real-time sync.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCommandDialogOpen(true)}
              className="group relative flex flex-col justify-between p-5 rounded-xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-md hover:bg-accent/20 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className="p-2.5 rounded-lg bg-secondary text-foreground group-hover:scale-105 transition-transform">
                  <FaGithub className="size-5" />
                </div>
                <Kbd className="bg-secondary/80 border text-xs px-2 py-0.5 group-hover:border-primary/30 transition-colors">
                  I
                </Kbd>
              </div>
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Import / Explore
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Browse existing projects or import repositories.
                </p>
              </div>
            </button>
          </div>

          {/* Projects List Component */}
          <div className="mt-2">
            <ProjectList
              onViewAll={() => {
                setCommandDialogOpen(true);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
