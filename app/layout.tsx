import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import BottomNav from '@/components/BottomNav';
import { AlertasProvider } from '@/context/AlertasProvider';
import { LocalizacaoProvider } from '@/context/LocalizacaoProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Radar Cidadão',
    template: 'Radar Cidadão - %s',
  },
  description: 'Registre alagamentos e acúmulo de lixo e acompanhe os alertas da sua região.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <LocalizacaoProvider>
          <AlertasProvider>
            <main id="app-container">
              {children}
              <BottomNav />
            </main>
          </AlertasProvider>
        </LocalizacaoProvider>
      </body>
    </html>
  );
}
