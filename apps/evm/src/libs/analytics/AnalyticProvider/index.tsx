import { PostHogProvider } from 'posthog-js/react';

import config from 'config';
import { version as APP_VERSION } from 'constants/version';
import { UserIdentifier } from './UserIdentifier';
import { appendHash } from './appendHash';

export interface AnalyticProviderProps {
  children?: React.ReactNode;
}

export const AnalyticProvider: React.FC<AnalyticProviderProps> = ({ children }) => {
  // Only enable analytics in production
  if (config.environment !== 'production') {
    return children;
  }

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

      {children}
    </PostHogProvider>
  );
};
