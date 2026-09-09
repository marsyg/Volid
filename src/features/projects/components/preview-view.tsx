'use client';

import { useState } from 'react';
import {
  ExternalLinkIcon,
  GlobeIcon,
  LaptopIcon,
  LockIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  TabletIcon,
  TerminalSquareIcon,
} from 'lucide-react';
import { useEditorStore } from '@/features/editor/store/useEditorStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const PreviewView = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [url, setUrl] = useState('http://localhost:3000');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const setTerminal = useEditorStore((state) => state.setTerminal);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const deviceWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-sidebar/50 select-none overflow-hidden">
      {/* Browser Chrome Header */}
      <div className="flex items-center justify-between gap-3 px-3 h-10 border-b border-border/80 bg-sidebar shrink-0">
        {/* Window controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="size-2.5 rounded-full bg-red-500/70" />
          <div className="size-2.5 rounded-full bg-yellow-500/70" />
          <div className="size-2.5 rounded-full bg-emerald-500/70" />
        </div>

        {/* Reload button */}
        <button
          type="button"
          onClick={handleRefresh}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
          title="Reload preview"
        >
          <RotateCcwIcon className={cn('size-3.5', isRefreshing && 'animate-spin')} />
        </button>

        {/* Address Bar */}
        <div className="flex-1 max-w-lg flex items-center gap-2 px-3 py-1 rounded-md bg-background border border-border/60 text-xs text-muted-foreground">
          <LockIcon className="size-3 text-emerald-500 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent outline-none text-xs text-foreground font-mono truncate"
          />
        </div>

        {/* Device Switcher & External Link */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center border border-border/60 rounded-md p-0.5 bg-background">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={cn(
                'p-1 rounded-xs transition-colors',
                device === 'desktop' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Desktop view"
            >
              <LaptopIcon className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={cn(
                'p-1 rounded-xs transition-colors',
                device === 'tablet' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Tablet view"
            >
              <TabletIcon className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={cn(
                'p-1 rounded-xs transition-colors',
                device === 'mobile' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Mobile view"
            >
              <SmartphoneIcon className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.open(url, '_blank')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
            title="Open in new window"
          >
            <ExternalLinkIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-muted/20">
        <div
          className={cn(
            'h-full w-full bg-background rounded-lg border border-border/70 shadow-sm flex flex-col items-center justify-center text-center p-8 transition-all duration-300',
            deviceWidths[device]
          )}
        >
          <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-xs">
            <GlobeIcon className="size-6" />
          </div>

          <h3 className="text-base font-semibold text-foreground">
            Development Server Preview
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Launch your development server in the integrated terminal to preview your web application in real time.
          </p>

          <div className="mt-5 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTerminal(true)}
              className="gap-2 text-xs"
            >
              <TerminalSquareIcon className="size-3.5" />
              Open Terminal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
