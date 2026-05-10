'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { UnautheticatedView } from '@/features/auth/components/unauthenticated-view';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Providers = ({ children }: { children: ReactNode }) => {
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
            <AuthLoading>AuthLoading ...</AuthLoading>

            <Unauthenticated>
              <UnautheticatedView></UnautheticatedView>
            </Unauthenticated>

            <Authenticated>{children}</Authenticated>
          </ThemeProvider>
        </ConvexProviderWithClerk>
      </TooltipProvider>
    </ClerkProvider>
  );
};
