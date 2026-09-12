import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

export const metadata: Metadata = {
  title: 'FreedomPlay — Universal Freedom-First Media Platform',
  description: 'An open publishing platform for videos, images, audio, documents, and uncensored discussion.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}