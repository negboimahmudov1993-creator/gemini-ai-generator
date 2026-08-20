import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/hooks/use-language';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DOMProtection } from '@/components/dom-protection';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'VibeGen AI — Content & Cover Letter Generator',
  description:
    'Generate polished cover letters and social media posts in seconds with AI-powered writing tailored to your tone and audience.',
  openGraph: {
    title: 'VibeGen AI — Content & Cover Letter Generator',
    description:
      'Generate polished cover letters and social media posts in seconds with AI-powered writing.',
    images: [{ url: 'https://bolt.new/static/og_default.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="notranslate" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={inter.className}>
        <DOMProtection>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <TooltipProvider delayDuration={200}>
                {children}
              </TooltipProvider>
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </DOMProtection>
      </body>
    </html>
  );
}