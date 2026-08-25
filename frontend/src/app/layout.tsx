import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Student360 AI - AI-Powered Student Lifecycle & Portfolio Platform',
  description: 'Centralized AI-powered student lifecycle management, predictive analytics, skill gap analysis, job matching, and digital portfolio platform.',
  keywords: ['Student Lifecycle', 'AI Education', 'Digital Portfolio', 'Placement Readiness', 'Skill Gap Analysis', 'ATS Resume Builder']
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
