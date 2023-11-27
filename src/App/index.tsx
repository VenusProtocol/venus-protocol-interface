import { AnalyticProvider } from 'packages/analytics';
import { ErrorBoundary } from 'packages/errors';
import { LunaUstWarningModal } from 'packages/lunaUstWarning';
import { Web3Wrapper } from 'packages/wallet';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';

import { queryClient } from 'clients/api';
import { AppVersionChecker } from 'containers/AppVersionChecker';
import { Layout } from 'containers/Layout';
import { AuthProvider } from 'context/AuthContext';
import { SentryErrorInfo } from 'packages/errors/SentryErrorInfo';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Router from './Router';

const NotificationCenter = lazy(() => import('packages/notifications/NotificationCenter'));

const App = () => (
  <ErrorBoundary>
    <MuiThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Web3Wrapper>
          <AuthProvider>
            <SentryErrorInfo />

            <AnalyticProvider>
              <HashRouter>
                <Layout>
                  <Router />
                </Layout>

                <AppVersionChecker />

                <LunaUstWarningModal />

                <Suspense>
                  <NotificationCenter />
                </Suspense>
              </HashRouter>
            </AnalyticProvider>
          </AuthProvider>
        </Web3Wrapper>
      </QueryClientProvider>
    </MuiThemeProvider>
  </ErrorBoundary>
);

export default App;
