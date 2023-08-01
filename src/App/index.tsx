import { Layout, ResetScrollOnRouteChange } from 'components';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'assets/styles/App.scss';
import { queryClient } from 'clients/api';
import { Web3Wrapper } from 'clients/web3';
import { AnalyticsProvider } from 'context/Analytics';
import { AuthProvider } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { ErrorLoggerProvider } from 'context/ErrorLogger';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Switch from './Switch';

const App = () => (
  <ErrorLoggerProvider>
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <SuccessfulTransactionModalProvider>
                <DisableLunaUstWarningProvider>
                  <HashRouter>
                    <ToastContainer />

                    <Layout>
                      <ResetScrollOnRouteChange />

                      <Switch />
                    </Layout>
                  </HashRouter>
                </DisableLunaUstWarningProvider>
              </SuccessfulTransactionModalProvider>
            </AnalyticsProvider>
          </AuthProvider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>
  </ErrorLoggerProvider>
);

export default App;
