import { PostHogProvider, usePostHog } from 'posthog-js/react';
import React, { useEffect } from 'react';

import config from 'config';
import { version as APP_VERSION } from 'constants/version';
import { useAccountAddress, useChainId } from 'packages/wallet';

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

  return null;
};

export interface AnalyticProviderProps {
  children?: React.ReactNode;
}

export const AnalyticProvider: React.FC<AnalyticProviderProps> = ({ children }) => (
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
