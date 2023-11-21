import * as Sentry from '@sentry/react';
import config from 'config';

import { version as APP_VERSION } from 'constants/version';

const initializeSentry = () =>
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.environment,
    release: APP_VERSION,
    attachStacktrace: true,
  });

export default initializeSentry;
