import { Suspense, lazy } from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';

import { queryClient } from 'clients/api';
import { Layout } from 'containers/Layout';
import { AnalyticProvider } from 'packages/analytics';
import { ErrorBoundary } from 'packages/errors';
import { SentryErrorInfo } from 'packages/errors/SentryErrorInfo';
import { LunaUstWarningModal } from 'packages/lunaUstWarning';
import { AuthHandler, AuthModal, Web3Wrapper } from 'packages/wallet';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Router from './Router';

const NotificationCenter = lazy(() => import('packages/notifications/NotificationCenter'));
const AppVersionChecker = lazy(() => import('containers/AppVersionChecker'));

const App = () => (
  <ErrorBoundary>
    <MuiThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Web3Wrapper>
          <SentryErrorInfo />

          <AnalyticProvider>
            <HashRouter>
              <Layout>
                <Router />
              </Layout>

              <AuthHandler />
              <AuthModal />
              <LunaUstWarningModal />

              <Suspense>
                <NotificationCenter />
              </Suspense>

              <Suspense>
                <AppVersionChecker />
              </Suspense>
            </HashRouter>
          </AnalyticProvider>
        </Web3Wrapper>
      </QueryClientProvider>
    </MuiThemeProvider>
  </ErrorBoundary>
);

export default App;
