'use client';

import { AuthProvider } from '@/lib/auth';
import { AnalyticsProvider } from '@/lib/analytics';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        {children}
      </AnalyticsProvider>
    </AuthProvider>
  );
}
