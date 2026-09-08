'use client';
import { useState } from 'react';
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
import { useEffect } from 'react';

export const ProjectIdView = ({ projectId }: { projectId: Id<'projects'> }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const isTerminalOpen = useEditorStore((state) => state.isTerminalOpen);
  const toggleTerminal = useEditorStore((state) => state.toggleTerminal);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleTerminal?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTerminal]);


  return (
    <div className="flex flex-col h-screen">
      <ViewSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'code' ? (
        <div className="flex-1 overflow-hidden">
          <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
            <Allotment.Pane
              snap
              minSize={MIN_FILE_EXPLORER_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              preferredSize={DEFAULT_SIDEBAR_WIDTH}
            >
              {/* You can pass onOpenTerminal here to toggle the terminal */}
              <FileExplorer projectId={projectId} />
            </Allotment.Pane>

            {/* Single Main Pane split vertically for Editor + Terminal */}
            <Allotment.Pane minSize={MIN_SIDEBAR_WIDTH} preferredSize={DEFAULT_MAIN_SIZE}>
              <Allotment vertical>
                <Allotment.Pane>
                  <TabBar activeTab={activeTab} setActiveTab={setActiveTab} projectId={projectId} />
                  <EditorView projectId={projectId} />
                </Allotment.Pane>
                {isTerminalOpen && (
                  <Allotment.Pane minSize={100} preferredSize={250}>
                    <VolidTerminal />
                  </Allotment.Pane>
                )}
              </Allotment>
            </Allotment.Pane>
          </Allotment>
        </div>
      ) : (
        <div className="flex-1">preview</div>
      )}
    </div>
  );
};
