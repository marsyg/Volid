"use client"

import { ConvexProviderWithClerk } from "convex/react-clerk"
import { ConvexReactClient, Authenticated, Unauthenticated, AuthLoading } from 'convex/react'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { ClerkProvider, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/nextjs'
import { UnautheticatedView } from '@/features/auth/components/unauthenticated-view'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <ThemeProvider

                    attribute="class"
                    defaultTheme='dark'
                    enableSystem
                    disableTransitionOnChange
                >

                    <AuthLoading>
                        AuthLoading ...
                    </AuthLoading>

                    <Unauthenticated>
                        <UnautheticatedView></UnautheticatedView>
                    </Unauthenticated>

                    <Authenticated>
                        <UserButton></UserButton>
                        {children}
                    </Authenticated>
                </ThemeProvider>

            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}
