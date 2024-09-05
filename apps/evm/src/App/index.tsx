import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';

import { queryClient } from 'clients/api';
import { AnalyticProvider } from 'libs/analytics';
import { ErrorBoundary } from 'libs/errors';
import { SentryErrorInfo } from 'libs/errors/SentryErrorInfo';
import { Web3Wrapper } from 'libs/wallet';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import { safeLazyLoad } from 'utilities';
import Routes from './Routes';

const NotificationCenter = safeLazyLoad(() => import('libs/notifications/NotificationCenter'));
const AppVersionChecker = safeLazyLoad(() => import('containers/AppVersionChecker'));

const App = () => (
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

              <SentryErrorInfo />
            </AnalyticProvider>
          </Web3Wrapper>
        </QueryClientProvider>
      </MuiThemeProvider>
    </HashRouter>
  </ErrorBoundary>
);

export default App;
