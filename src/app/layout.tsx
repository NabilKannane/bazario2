import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bazario - Marketplace pour Artisans',
  description: 'Découvrez des créations artisanales uniques faites avec passion par des artisans français.',
  keywords: 'artisan, marketplace, créations, fait-main, france',
  authors: [{ name: 'Bazario' }],
  openGraph: {
    title: 'Bazario - Marketplace pour Artisans',
    description: 'Découvrez des créations artisanales uniques faites avec passion par des artisans français.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}