import { PostHogProvider } from 'posthog-js/react';

import config from 'config';
import { version as APP_VERSION } from 'constants/version';
import { AuthAnalyticVariantProvider } from '../context';
import { UserIdentifier } from './UserIdentifier';
import { WalletAnalyticSender } from './WalletAnalyticSender';
import { appendHash } from './appendHash';

export interface AnalyticProviderProps {
  children?: React.ReactNode;
}

export const AnalyticProvider: React.FC<AnalyticProviderProps> = ({ children }) => {
  const dom =
    // Only enable analytics in production
    config.environment !== 'production' ? (
      children
    ) : (
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

        {children}
      </PostHogProvider>
    );

  return (
    <AuthAnalyticVariantProvider>
      {dom}

      <WalletAnalyticSender />
    </AuthAnalyticVariantProvider>
  );
};
