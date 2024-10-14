import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { HashRouter } from 'react-router-dom';

import { queryClient } from 'clients/api';
import { AnalyticProvider } from 'libs/analytics';
import { ErrorBoundary } from 'libs/errors';
import { SentryErrorInfo } from 'libs/errors/SentryErrorInfo';
import { Web3Wrapper } from 'libs/wallet';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import { MAIN_PRODUCTION_HOST } from 'constants/production';
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

    <ErrorBoundary>
      <HashRouter>
        <MuiThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Web3Wrapper>
              <AnalyticProvider>
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

                <SentryErrorInfo />
              </AnalyticProvider>
            </Web3Wrapper>
          </QueryClientProvider>
        </MuiThemeProvider>
      </HashRouter>
    </ErrorBoundary>
  </>
);

export default App;
