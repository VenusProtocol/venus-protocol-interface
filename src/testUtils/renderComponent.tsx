import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Web3Wrapper } from 'clients/web3';
import { AuthContext, AuthContextValue } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

const renderComponent = (
  children: React.ReactElement | (() => React.ReactElement),
  {
    authContextValue = {},
  }: {
    authContextValue?: Partial<AuthContextValue>;
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
            <SuccessfulTransactionModalProvider>
              <DisableLunaUstWarningProvider>
                <HashRouter>
                  <ToastContainer />

                  <Switch>
                    <Route
                      path="/"
                      component={typeof children === 'function' ? children : () => children}
                    />
                  </Switch>
                </HashRouter>
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
