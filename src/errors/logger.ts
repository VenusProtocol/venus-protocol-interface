import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import config from 'config';

import { DAPP_HOSTS } from 'constants/dAppHosts';
import { version as DAPP_VERSION } from 'constants/version';

export const initializeErrorLogger = () => {
  let environment = 'local';

  if (!window) {
    environment = 'mock';
  } else if (DAPP_HOSTS.testnet.includes(window.location.host)) {
    environment = 'testnet';
  } else if (DAPP_HOSTS['app-preview'].includes(window.location.host)) {
    environment = 'app-preview';
  } else if (DAPP_HOSTS.mainnet === window.location.host) {
    environment = 'mainnet';
  }

  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [new BrowserTracing()],
    environment,
    release: DAPP_VERSION,
  });
};

export const logError = (error: string | unknown) => {
  // Do not log error if app is running locally or in mocked environment
  if (!window || window.location.hostname === 'localhost') {
    return;
  }

  if (typeof error === 'string') {
    Sentry.captureMessage(error);
  } else {
    Sentry.captureException(error);
  }
};
