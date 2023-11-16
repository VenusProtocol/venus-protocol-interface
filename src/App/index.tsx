import * as Sentry from '@sentry/react';
import { AnalyticProvider } from 'packages/analytics';
import { Suspense, lazy } from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';

import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { Layout } from 'containers/Layout';
import { AuthProvider } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
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
              <DisableLunaUstWarningProvider>
                <HashRouter>
                  <Layout>
                    <Router />
                  </Layout>

                  <Suspense>
                    <NotificationCenter />
                  </Suspense>
                </HashRouter>
              </DisableLunaUstWarningProvider>
            </AnalyticProvider>
          </AuthProvider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>
  </Sentry.ErrorBoundary>
);

export default App;
