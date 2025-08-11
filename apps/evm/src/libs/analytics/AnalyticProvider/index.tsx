import { PostHogProvider } from 'posthog-js/react';

import config from 'config';
import { version as APP_VERSION } from 'constants/version';
import { AuthAnalyticVariantProvider } from '../context';
import { UserIdentifier } from './UserIdentifier';
import { WalletAnalyticSender } from './WalletAnalyticSender';
import { appendHash } from './appendHash';

// Detect session and distinct IDs passed through search params
const hashParams = new URLSearchParams(window.location.hash.substring(2));
const distinctId = hashParams.get('distinctId') || undefined;
const sessionId = hashParams.get('sessionId') || undefined;

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
          bootstrap: {
            // Pass session and distinct IDs passed through search params to follow users across
            // Venus apps
            distinctID: distinctId,
            sessionID: sessionId,
          },
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
