import { FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Code2Icon, EyeIcon, TerminalSquareIcon } from 'lucide-react';
import { useEditorStore } from '@/features/editor/store/useEditorStore';
import { Kbd } from '@/components/ui/kbd';

interface ViewSwitcherProps {
  activeTab: 'code' | 'preview';
  setActiveTab: (tab: 'code' | 'preview') => void;
}

export const ViewSwitcher = ({ activeTab, setActiveTab }: ViewSwitcherProps) => {
  const isTerminalOpen = useEditorStore((state) => state.isTerminalOpen);
  const toggleTerminal = useEditorStore((state) => state.toggleTerminal);

  return (
    <nav className="flex items-center justify-between h-9 px-2 bg-sidebar border-b border-border/80 select-none">
      {/* Left: View Modes */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
            activeTab === 'code'
              ? 'bg-background text-foreground shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
        >
          <Code2Icon className="size-3.5" />
          <span>Code</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
            activeTab === 'preview'
              ? 'bg-background text-foreground shadow-2xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
        >
          <EyeIcon className="size-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Right: Tools & Terminal Toggle */}
      <div className="flex items-center gap-2">
        {/* Terminal Toggle Button */}
        <button
          type="button"
          onClick={() => toggleTerminal?.()}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
            isTerminalOpen
              ? 'bg-primary/10 border-primary/40 text-primary'
              : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40'
          )}
          title="Toggle Terminal (Ctrl + `)"
        >
          <TerminalSquareIcon className="size-3.5" />
          <span>Terminal</span>
          <Kbd className="text-[10px] px-1 py-0 ml-1 border bg-secondary/80">Ctrl+`</Kbd>
        </button>

        <div className="h-4 w-px bg-border/60 mx-1" />

        {/* GitHub Export */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors cursor-pointer"
        >
          <FaGithub className="size-3.5" />
          <span>Export</span>
        </button>
      </div>
    </nav>
  );
};

export default ViewSwitcher;
