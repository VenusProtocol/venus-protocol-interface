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

const NotificationCenter = lazy(() => import('packages/notifications/NotificationCenter'));

const App = () => (
  <Sentry.ErrorBoundary>
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthProvider>
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
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>
  </Sentry.ErrorBoundary>
);

export default App;
