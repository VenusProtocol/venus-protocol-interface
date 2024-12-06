import * as Sentry from '@sentry/react';

import config from 'config';

export const logError = (error: string | unknown) => {
  // Only send errors to Sentry in production
  if (config.environment !== 'production') {
    console.error(`[Logger]: ${error}`);
    return;
  }

  if (typeof error === 'string') {
    Sentry.captureMessage(error);
  } else {
    Sentry.captureException(error);
  }
};
