import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import config from 'config';
import React, { useEffect } from 'react';

import { version as APP_VERSION } from 'constants/version';

export const ErrorLoggerProvider: React.FC = ({ children }) => {
  useEffect(() => {
    Sentry.init({
      dsn: config.sentryDsn,
      integrations: [new BrowserTracing()],
      environment: config.environment,
      release: APP_VERSION,
    });
  }, []);

  return <Sentry.ErrorBoundary>{children}</Sentry.ErrorBoundary>;
};

export const logError = (error: string | unknown) => {
  // Only log errors in live environments
  if (config.environment !== 'mainnet') {
    console.error(`[Logger]: ${error}`);
    return;
  }

  if (typeof error === 'string') {
    Sentry.captureMessage(error);
  } else {
    Sentry.captureException(error);
  }
};
