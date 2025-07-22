import type { CaptureResult } from 'posthog-js';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import config from 'config';
import { version as APP_VERSION } from 'constants/version';
import { useAccountAddress, useChainId } from 'libs/wallet';

const UserIdentifier: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const posthog = usePostHog();

  // Identify user by their account address along with the network chain they are on
  useEffect(() => {
    if (accountAddress) {
      posthog?.identify(accountAddress, { chainId });
    } else {
      posthog?.reset();
    }
  }, [accountAddress, chainId, posthog]);

  return undefined;
};

export interface AnalyticProviderProps {
  children?: React.ReactNode;
}

export const AnalyticProvider: React.FC<AnalyticProviderProps> = ({ children }) => {
  // Only enable analytics in production
  if (config.environment !== 'production') {
    return children;
  }

  const appendHash = (event: CaptureResult | null): CaptureResult | null => {
    if (event?.properties?.$current_url) {
      const parsed = new URL(event.properties.$current_url);

      // Append hash to the $pathname property
      if (parsed.hash) {
        event.properties.$pathname = parsed.pathname + parsed.hash;
      }
    }
    return event;
  };

  return (
    <PostHogProvider
      apiKey={config.posthog.apiKey}
      options={{
        api_host: config.posthog.hostUrl,
        persistence: 'memory',
        name: APP_VERSION,
        before_send: appendHash,
      }}
    >
      <UserIdentifier />

      <VercelAnalytics mode="production" />

      {children}
    </PostHogProvider>
  );
};
