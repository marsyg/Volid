import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients and Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Decorative Glows */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="group flex items-center gap-2 mb-2">
            <span className="font-mono text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent group-hover:from-neutral-200 group-hover:to-neutral-500 transition-all duration-300">
              VOLID
            </span>
          </Link>
          <p className="text-neutral-400 font-sans text-sm">
            Sign in to access your cloud workspace and projects
          </p>
        </div>

        {/* Embedded Clerk Card */}
        <div className="w-full bg-card backdrop-blur-xl border border-border/40 rounded-2xl p-1 shadow-2xl">
          <SignIn
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: 'oklch(0.6562 0.1826 262.74)', // matches ring / brand primary
                colorBackground: 'oklch(0.25 0.012 264.34)', // matches card / sidebar background
                colorInputBackground: 'oklch(0.2925 0.0157 264.3)',
                colorBorder: 'oklch(1 0 0 / 10%)',
                colorText: '#ffffff',
                colorTextSecondary: '#a3a3a3',
                fontFamily: 'var(--font-inter), sans-serif',
              },
              elements: {
                card: 'border-0 bg-transparent shadow-none',
                headerTitle: 'hidden', // hide duplicate header
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border border-border/40 hover:bg-neutral-800 transition-colors',
                formButtonPrimary: 'bg-white text-black hover:bg-neutral-200 transition-colors font-semibold',
                footerActionLink: 'text-white hover:text-neutral-200',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
