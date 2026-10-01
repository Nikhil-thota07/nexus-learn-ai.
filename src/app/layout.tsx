import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Nexus Learn AI — Your learning path should know you',
  description:
    'Continuously modeling what a student knows, does not know, misunderstands, and how confident they are. Dynamic EdTech platform with misconception detection and adaptive curriculum.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-main antialiased overflow-x-hidden">
        <Navbar />
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
