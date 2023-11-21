import * as Sentry from '@sentry/react';
import config from 'config';

export const logError = (error: string | unknown) => {
  // Only log errors in live environments
  if (config.isLocalServer || config.environment !== 'mainnet') {
    console.error(`[Logger]: ${error}`);
    return;
  }

  if (typeof error === 'string') {
    Sentry.captureMessage(error);
  } else {
    Sentry.captureException(error);
  }
};
