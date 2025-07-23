'use client';

import { ReactNode } from 'react';
import { SessionProvider } from './SessionProvider';
import NotificationContainer from '@/components/common/Notification';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <NotificationContainer />
    </SessionProvider>
  );
}