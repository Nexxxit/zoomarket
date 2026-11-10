import type { Metadata } from 'next';
import { Comfortaa, Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers/Providers';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-comfortaa',
  weight: ['600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Айболит — Заботливый зоомаркет',
  description: 'Современный дизайн-макет профессионального e-commerce зоомаркета Айболит.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${comfortaa.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-inter text-stone-900 min-h-dvh antialiased">
        <Providers>
          <div className="flex flex-col min-h-dvh bg-stone-50">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
