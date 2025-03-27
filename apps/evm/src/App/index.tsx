import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { HashRouter } from 'react-router-dom';

import { Analytics } from '@vercel/analytics/react';
import { queryClient } from 'clients/api';
import { MuiThemeProvider } from 'containers/MuiThemeProvider';
import { ErrorBoundary } from 'libs/errors';
import { SentryErrorInfo } from 'libs/errors/SentryErrorInfo';
import { Web3Wrapper } from 'libs/wallet';

import config from 'config';
import { MAIN_PRODUCTION_HOST } from 'constants/production';
import { ThemeHandler } from 'containers/ThemeHandler';
import { safeLazyLoad } from 'utilities';
import Routes from './Routes';

const NotificationCenter = safeLazyLoad(() => import('libs/notifications/NotificationCenter'));
const AppVersionChecker = safeLazyLoad(() => import('containers/AppVersionChecker'));
const GaslessChecker = safeLazyLoad(() => import('containers/GaslessChecker'));
const ResendPayingGasModal = safeLazyLoad(() => import('containers/ResendPayingGasModal'));

const isMainProductionHost =
  typeof window !== 'undefined' && MAIN_PRODUCTION_HOST === window.location.host;

const App = () => (
  <>
    {
      // Only index the main production website (https://app.venus.io) with search engines
      !isMainProductionHost && (
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
      )
    }

    <HashRouter>
      <MuiThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Web3Wrapper>
              <Routes />

              <Suspense>
                <NotificationCenter />
              </Suspense>

              <Suspense>
                <AppVersionChecker />
              </Suspense>

              <Suspense>
                <GaslessChecker />
              </Suspense>

              <Suspense>
                <ResendPayingGasModal />
              </Suspense>

              <ThemeHandler />

              <SentryErrorInfo />

              <Analytics
                mode={config.environment === 'production' ? 'production' : 'development'}
              />
            </Web3Wrapper>
          </ErrorBoundary>
        </QueryClientProvider>
      </MuiThemeProvider>
    </HashRouter>
  </>
);

export default App;
