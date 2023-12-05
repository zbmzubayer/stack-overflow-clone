import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/contexts/theme-provider';
import connectToDb from '@/db';
import './globals.css';
import '../styles/prism.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
});

export const metadata: Metadata = {
  title: 'Dev Overflow',
  description:
    'A community of developers helping each other. Get unstuck, share ideas, and learn together. Join us, it only takes a minute.',
  applicationName: 'Dev Overflow',
  creator: 'ZBM',
  authors: [{ name: 'ZBM', url: 'https://www.linkedin.com/in/zbmzubayer' }],
  keywords: ['dev', 'overflow', 'stack overflow', 'dev overflow', 'developer', 'community'],
  metadataBase: new URL('https://devoverflow.zbm.vercel.app'),
  icons: ['/assets/images/logo.png'],
};

// Connecting to DB
connectToDb();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'primary-gradient',
          footerActionLink: 'primary-text-gradient hover:text-primary-500',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${spaceGrotesk.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
