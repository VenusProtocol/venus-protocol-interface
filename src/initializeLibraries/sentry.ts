import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import config from 'config';

import { version as APP_VERSION } from 'constants/version';

const initializeSentry = () =>
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [new BrowserTracing()],
    environment: config.environment,
    release: APP_VERSION,
  });

export default initializeSentry;
