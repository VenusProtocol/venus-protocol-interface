import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'clients/api';
import config from 'config';
import { AnalyticProvider } from 'libs/analytics';
import { ErrorBoundary } from 'libs/errors';
import { SentryErrorInfo } from 'libs/errors/SentryErrorInfo';
import { Web3Wrapper } from 'libs/wallet';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { HashRouter } from 'react-router';
import { safeLazyLoad } from 'utilities';
import { ChainUpgradeHandler } from './ChainUpgradeHandler';
import { MuiThemeProvider } from './MuiThemeProvider';
import Routes from './Routes';

const NotificationCenter = safeLazyLoad(() => import('libs/notifications/NotificationCenter'));
const AppVersionChecker = safeLazyLoad(() => import('containers/AppVersionChecker'));
const GaslessChecker = safeLazyLoad(() => import('containers/GaslessChecker'));
const ResendPayingGasModal = safeLazyLoad(() => import('containers/ResendPayingGasModal'));
const ImportPositionsModal = safeLazyLoad(() => import('containers/ImportPositionsModal'));

const App = () => (
  <>
    {
      // Only index production with search engines
      config.environment !== 'production' && (
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

                <Suspense>
                  <ImportPositionsModal />
                </Suspense>

                <ChainUpgradeHandler />

                <SentryErrorInfo />
              </AnalyticProvider>
            </Web3Wrapper>
          </ErrorBoundary>
        </QueryClientProvider>
      </MuiThemeProvider>
    </HashRouter>
  </>
);

export default App;
