import * as Sentry from '@sentry/react';
import { AnalyticProvider } from 'packages/analytics';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { Layout } from 'containers/Layout';
import { AuthProvider } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Router from './Router';

const App = () => (
  <Sentry.ErrorBoundary>
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthProvider>
            <AnalyticProvider>
              <SuccessfulTransactionModalProvider>
                <DisableLunaUstWarningProvider>
                  <HashRouter>
                    <ToastContainer />

                    <Layout>
                      <Router />
                    </Layout>
                  </HashRouter>
                </DisableLunaUstWarningProvider>
              </SuccessfulTransactionModalProvider>
            </AnalyticProvider>
          </AuthProvider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>
  </Sentry.ErrorBoundary>
);

export default App;
