declare global {
  interface Window {
    IngeniumTracker?: {
      init?: (config: { endpoint: string; siteId: string }) => void;
      track: (eventType: string, context?: Record<string, unknown>, properties?: Record<string, unknown>) => void;
      getVisitorId?: () => string;
      getSessionId?: () => string;
    };
    __atticTrackerInitialized?: boolean;
  }
}

export {};
