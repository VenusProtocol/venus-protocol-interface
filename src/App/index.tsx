import * as Sentry from '@sentry/react';
import { AnalyticProvider } from 'packages/analytics';
import { LunaUstWarningModal } from 'packages/lunaUstWarning';
import { Web3Wrapper } from 'packages/wallet';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';

import { queryClient } from 'clients/api';
import { Layout } from 'containers/Layout';
import { AuthProvider } from 'context/AuthContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Router from './Router';
import { SentryErrorInfo } from './SentryErrorInfo';

const NotificationCenter = lazy(() => import('packages/notifications/NotificationCenter'));

const App = () => (
  <Sentry.ErrorBoundary>
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
  </Sentry.ErrorBoundary>
);

export default App;
