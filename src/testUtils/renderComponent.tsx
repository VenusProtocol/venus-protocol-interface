import { render } from '@testing-library/react';
import { getDefaultProvider } from 'ethers';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Web3Wrapper } from 'clients/web3';
import { AuthContext, AuthContextValue } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import initializeLibraries from '../initializeLibraries';

const renderComponent = (
  children: React.ComponentType<any> | React.ReactElement | (() => React.ReactElement),
  {
    authContextValue = {},
  }: {
    authContextValue?: Partial<AuthContextValue>;
  } = {},
) => {
  initializeLibraries();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const defaultAuthContextValues: AuthContextValue = {
    login: jest.fn(),
    logOut: jest.fn(),
    openAuthModal: jest.fn(),
    closeAuthModal: jest.fn(),
    isConnected: false,
    provider: getDefaultProvider(),
    accountAddress: '',
    ...authContextValue,
  };

  const renderRes = render(
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthContext.Provider value={defaultAuthContextValues}>
            <SuccessfulTransactionModalProvider>
              <DisableLunaUstWarningProvider>
                <BrowserRouter>
                  <ToastContainer />

                  <Switch>
                    <Route
                      path="/"
                      component={typeof children === 'function' ? children : () => children}
                    />
                  </Switch>
                </BrowserRouter>
              </DisableLunaUstWarningProvider>
            </SuccessfulTransactionModalProvider>
          </AuthContext.Provider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>,
  );

  return {
    ...renderRes,
    queryClient,
  };
};

export default renderComponent;
