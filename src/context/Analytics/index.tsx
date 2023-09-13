import config from 'config';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import React, { useEffect } from 'react';

import { version as APP_VERSION } from 'constants/version';
import { useAuth } from 'context/AuthContext';

const UserIdentifier: React.FC = () => {
  const { accountAddress } = useAuth();
  const posthog = usePostHog();

  // Identify user by their account address
  useEffect(() => {
    if (accountAddress) {
      posthog?.identify(accountAddress);
    } else {
      posthog?.reset();
    }
  }, [accountAddress, posthog]);

  return null;
};

export interface AnalyticsProviderProps {
  children?: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => (
  <PostHogProvider
    apiKey={config.posthog.apiKey}
    options={{
      api_host: config.posthog.hostUrl,
      persistence: 'memory',
      name: APP_VERSION,
    }}
  >
    <UserIdentifier />

    {children}
  </PostHogProvider>
);

export * from './useAnalytics';
export { default as useAnalytics } from './useAnalytics';
