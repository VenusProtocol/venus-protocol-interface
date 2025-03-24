import * as Sentry from '@sentry/react';

import config from 'config';

export const logError = (error: string | unknown) => {
  // Only send errors to Sentry in production
  if (config.environment !== 'production') {
    console.error(`[Logger]: ${JSON.stringify(error)}`);
    return;
  }

  // Safari throws a "TypeError: Load failed" error if the fetch is canceled
  // e.g., if the user navigates away from the page before the request is finished
  // we can safely filter them out from being logged
  if (error instanceof Error && error.name === 'TypeError' && error.message === 'Load failed') {
    return;
  }

  if (typeof error === 'string') {
    Sentry.captureMessage(error);
  } else {
    Sentry.captureException(error);
  }
};
