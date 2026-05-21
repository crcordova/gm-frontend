'use client';

import { createContext, useContext, useCallback } from 'react';

type EventName =
  | 'page_view'
  | 'property_view'
  | 'search_performed'
  | 'filter_applied'
  | 'property_publish_started'
  | 'property_publish_submitted'
  | 'property_publish_success'
  | 'property_publish_error'
  | 'login_attempt'
  | 'login_success'
  | 'login_error'
  | 'register_attempt'
  | 'register_success'
  | 'register_error'
  | 'logout'
  | 'cta_click'
  | 'contact_click'
  | 'favorite_click';

interface EventPayload {
  event: EventName;
  timestamp: number;
  path: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}

interface AnalyticsContextType {
  track: (event: EventName, metadata?: Record<string, unknown>) => void;
  trackPageView: (path?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/analytics/events`
  : null;

function sendToBackend(payload: EventPayload) {
  if (!ANALYTICS_ENDPOINT) return;

  // Fire and forget - don't block UI
  fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Silently fail analytics to not disrupt user experience
  });
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const track = useCallback((event: EventName, metadata?: Record<string, unknown>) => {
    const payload: EventPayload = {
      event,
      timestamp: Date.now(),
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      metadata,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', payload);
    }

    // Send to backend if available
    sendToBackend(payload);
  }, []);

  const trackPageView = useCallback((path?: string) => {
    track('page_view', { path: path || (typeof window !== 'undefined' ? window.location.pathname : '') });
  }, [track]);

  const AnalyticsContextProvider = AnalyticsContext.Provider;
  return (
    <AnalyticsContextProvider value={{ track, trackPageView }}>
      {children}
    </AnalyticsContextProvider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
