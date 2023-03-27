import * as Sentry from '@sentry/react';
import { Layout, ResetScrollOnRouteChange } from 'components';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'assets/styles/App.scss';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AuthProvider } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Switch from './Switch';

const App = () => (
  <Sentry.ErrorBoundary>
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthProvider>
            <SuccessfulTransactionModalProvider>
              <DisableLunaUstWarningProvider>
                <BrowserRouter>
                  <ToastContainer />

                  <Layout>
                    <ResetScrollOnRouteChange />

                    <Switch />
                  </Layout>
                </BrowserRouter>
              </DisableLunaUstWarningProvider>
            </SuccessfulTransactionModalProvider>
          </AuthProvider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>
  </Sentry.ErrorBoundary>
);

export default App;
