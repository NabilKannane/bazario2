'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import NotificationContainer from '@/components/common/Notification';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      // Définir les options du provider si nécessaire
      refetchInterval={5 * 60} // 5 minutes
      refetchOnWindowFocus={true}
    >
      {children}
      <NotificationContainer />
    </SessionProvider>
  );
}
