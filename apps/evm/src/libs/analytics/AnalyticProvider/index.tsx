// Bundle the PostHog extensions we use, so they don't have to be fetched from PostHog's CDN (see
// disable_external_dependency_loading below)
import 'posthog-js/dist/dead-clicks-autocapture';
import 'posthog-js/dist/web-vitals';
import { PostHogProvider } from 'posthog-js/react';

import config from 'config';
import { version as APP_VERSION } from 'constants/version';
import { AuthAnalyticVariantProvider } from '../context';
import { RouteChangeTracker } from './RouteChangeTracker';
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
          // RouteChangeTracker sends $pageview itself, so the automatic one would double count
          capture_pageview: false,
          persistence: 'memory',
          name: APP_VERSION,
          before_send: appendHash,
          // Never execute JavaScript served by PostHog (remote config script, site apps, surveys,
          // toolbar, recorder). Anyone with admin access to the PostHog project, or control of its
          // CDN, could otherwise run arbitrary code on the dApp and tamper with users' transactions
          disable_external_dependency_loading: true,
          disable_surveys: true,
          opt_in_site_apps: false,
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

      <RouteChangeTracker />
      <WalletAnalyticSender />
    </AuthAnalyticVariantProvider>
  );
};
