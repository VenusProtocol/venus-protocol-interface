import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Web3Wrapper } from 'clients/web3';
import { AuthContext, IAuthContextValue } from 'context/AuthContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { RefreshContextProvider } from 'context/RefreshContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

const renderComponent = (
  children: React.ReactElement | (() => React.ReactElement),
  {
    authContextValue = {},
  }: {
    authContextValue?: Partial<IAuthContextValue>;
  } = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

  const defaultAuthContextValues = {
    login: jest.fn(),
    logOut: jest.fn(),
    openAuthModal: jest.fn(),
    closeAuthModal: jest.fn(),
    account: undefined,
    ...authContextValue,
  };

  const renderRes = render(
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthContext.Provider value={defaultAuthContextValues}>
            <RefreshContextProvider>
              <SuccessfulTransactionModalProvider>
                <BrowserRouter>
                  <ToastContainer />

                  <Switch>
                    <Route
                      path="/"
                      component={typeof children === 'function' ? children : () => children}
                    />
                  </Switch>
                </BrowserRouter>
              </SuccessfulTransactionModalProvider>
            </RefreshContextProvider>
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
