'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      // 1. Monaco Editor benign cancellation during re-render/unmount
      if (
        reason?.type === 'cancelation' ||
        reason?.msg === 'operation is manually canceled' ||
        reason?.message === 'operation is manually canceled'
      ) {
        event.preventDefault();
        return;
      }

      // 2. Third-party browser extension errors (e.g. Urban VPN / M_ID)
      const stack = typeof reason?.stack === 'string' ? reason.stack : '';
      const message = typeof reason?.message === 'string' ? reason.message : '';
      if (
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        message.includes("reading 'M_ID'")
      ) {
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ClerkProvider>
      <TooltipProvider>
        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ConvexProviderWithClerk>
      </TooltipProvider>
    </ClerkProvider>
  );
};
