'use client';

import { useState, useEffect } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { TabBar } from '@/features/editor/components/tab-bar';
import ViewSwitcher from './view-switcher';
import { Allotment } from 'allotment';
import {
  DEFAULT_MAIN_SIZE,
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_FILE_EXPLORER_WIDTH,
  MIN_SIDEBAR_WIDTH,
} from '@/consant';
import VolidTerminal from '@/components/terminal/terminal';
import 'allotment/dist/style.css';
import { FileExplorer } from '@/features/projects/components/fileExplorer';
import { EditorView } from '@/features/editor/components/editor-view';
import { useEditorStore } from '@/features/editor/store/useEditorStore';
import { PreviewView } from './preview-view';
import { TerminalSquareIcon, XIcon } from 'lucide-react';
import { useWebContainer } from '../hooks/use-webContianer';
import { GlobalSearchDialogBox } from './global-Search-dialog-box';

export const ProjectIdView = ({ projectId }: { projectId: Id<'projects'> }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const isTerminalOpen = useEditorStore((state) => state.isTerminalOpen);
  const toggleTerminal = useEditorStore((state) => state.toggleTerminal);
  const setTerminal = useEditorStore((state) => state.setTerminal);
  const toggleQuickOpenBox = useEditorStore((state) => state.toggleQuickOpenBox);
  useWebContainer(projectId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleTerminal?.();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        toggleQuickOpenBox?.();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleQuickOpenBox?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal, toggleQuickOpenBox]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <ViewSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'code' ? (
        <div className="flex-1 overflow-hidden">
          <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
            {/* File Explorer Pane */}
            <Allotment.Pane
              snap
              minSize={MIN_FILE_EXPLORER_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              preferredSize={DEFAULT_SIDEBAR_WIDTH}
            >
              <FileExplorer projectId={projectId} />
            </Allotment.Pane>

            {/* Main Area: Editor + Terminal Panes */}
            <Allotment.Pane minSize={MIN_SIDEBAR_WIDTH} preferredSize={DEFAULT_MAIN_SIZE}>
              <Allotment vertical defaultSizes={[700, 300]}>
                {/* Editor Pane */}
                <Allotment.Pane minSize={200}>
                  <div className="flex flex-col h-full overflow-hidden">
                    <TabBar activeTab={activeTab} setActiveTab={setActiveTab} projectId={projectId} />
                    <EditorView projectId={projectId} />
                  </div>
                </Allotment.Pane>

                {/* Terminal Pane with Titlebar */}
                {isTerminalOpen && (
                  <Allotment.Pane minSize={120} preferredSize={280}>
                    <div className="flex flex-col h-full w-full bg-sidebar border-t border-border/80 overflow-hidden select-none">
                      {/* Terminal Header Bar */}
                      <div className="flex items-center justify-between px-3 h-8 border-b border-border/80 bg-sidebar/90 shrink-0 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <TerminalSquareIcon className="size-3.5 text-primary" />
                          <span className="font-semibold text-foreground text-xs">Terminal</span>
                          <span className="text-[11px] text-muted-foreground/80 font-mono">jsh</span>
                          <span className="inline-block size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setTerminal(false)}
                            className="p-1 rounded-sm hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer"
                            title="Close Terminal"
                          >
                            <XIcon className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Terminal Body */}
                      <div className="flex-1 w-full overflow-hidden">
                        <VolidTerminal />
                      </div>
                    </div>
                  </Allotment.Pane>
                )}
              </Allotment>
            </Allotment.Pane>
          </Allotment>
        </div>
      ) : (
        <PreviewView />
      )}

      <GlobalSearchDialogBox projectId={projectId} />
    </div>
  );
};
