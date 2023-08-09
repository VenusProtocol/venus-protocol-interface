import config from 'config';
import noop from 'noop-ts';
import { PostHog, PostHogProvider, usePostHog } from 'posthog-js/react';
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

export const AnalyticsProvider: React.FC = ({ children }) => (
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

export const useAnalytics = () => {
  const posthog = usePostHog();

  const captureEvent: PostHog['capture'] =
    config.environment === 'mainnet' && posthog ? posthog.capture : noop;

  return {
    captureEvent,
  };
};
