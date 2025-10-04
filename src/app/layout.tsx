import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';
import { ShortcutsProvider } from '@/components/advanced/keyboard-shortcuts';

export const metadata: Metadata = {
  title: 'Nubenta Care - Hospital Management System',
  description: 'A World-Class Hospital Management System - Powered by Nubenta Technology Limited',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <ThemeProvider
            defaultTheme="system"
            enableSystemTheme={true}
            enableTransitionOnChange={true}
            storageKey="health-management-theme"
        >
            <ShortcutsProvider>
                <div className="flex-grow">{children}</div>
                <Toaster />
            </ShortcutsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
