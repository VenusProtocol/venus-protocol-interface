import * as Sentry from '@sentry/react';
import useGetLatestAppVersion from 'clients/api/queries/getLatestAppVersion/useGetLatestAppVersion';
import { compareVersions } from 'compare-versions';

import config from 'config';
import { version as APP_VERSION } from 'constants/version';

export interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

Sentry.init({
  dsn: config.sentryDsn,
  environment: config.environment,
  release: APP_VERSION,
  attachStacktrace: true,
  tracesSampleRate: 0,
  integrations: [
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['venus-evm'],
      behaviour: 'drop-error-if-contains-third-party-frames',
    }),
  ],
});

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const { data } = useGetLatestAppVersion();
  const latestAppVersion = data?.version;

  return (
    <Sentry.ErrorBoundary
      onError={e => {
        // Prevent sending errors from old releases
        if (latestAppVersion && compareVersions(latestAppVersion, APP_VERSION)) {
          return undefined;
        }

        return e;
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
