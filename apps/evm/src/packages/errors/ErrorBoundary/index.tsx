import * as Sentry from '@sentry/react';

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
});

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => (
  <Sentry.ErrorBoundary>{children}</Sentry.ErrorBoundary>
);
