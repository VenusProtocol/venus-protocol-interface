import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Web3Wrapper } from 'clients/web3';
import { AuthContext, IAuthContextValue } from 'context/AuthContext';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { init as initTranslationLibrary } from 'translation';
import Theme from 'theme';
import { RefreshContextProvider } from 'context/RefreshContext';
import { VaiContext, IVaiContextValue } from 'context/VaiContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider/MuiThemeProvider';
import BigNumber from 'bignumber.js';

// Initialize internationalization library
initTranslationLibrary();

const renderComponent = (
  children: React.ReactElement | (() => React.ReactElement),
  {
    authContextValue = {},
    vaiContextValue = {},
  }: {
    authContextValue?: Partial<IAuthContextValue>;
    vaiContextValue?: Partial<IVaiContextValue>;
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
  const defaultVaiContextValues = {
    userVaiMinted: new BigNumber(0),
    userVaiBalance: new BigNumber(0),
    userVaiEnabled: false,
    mintableVai: new BigNumber(0),
    ...vaiContextValue,
  };

  const renderRes = render(
    <Theme>
      <Web3Wrapper>
        <QueryClientProvider client={queryClient}>
          <MuiThemeProvider>
            <AuthContext.Provider value={defaultAuthContextValues}>
              <RefreshContextProvider>
                <VaiContext.Provider value={defaultVaiContextValues}>
                  <SuccessfulTransactionModalProvider>
                    <BrowserRouter>
                      <ToastContainer
                        autoClose={8000}
                        transition={Slide}
                        hideProgressBar
                        newestOnTop
                        position={toast.POSITION.TOP_LEFT}
                      />

                      <Switch>
                        <Route
                          path="/"
                          component={typeof children === 'function' ? children : () => children}
                        />
                      </Switch>
                    </BrowserRouter>
                  </SuccessfulTransactionModalProvider>
                </VaiContext.Provider>
              </RefreshContextProvider>
            </AuthContext.Provider>
          </MuiThemeProvider>
        </QueryClientProvider>
      </Web3Wrapper>
    </Theme>,
  );

  return {
    ...renderRes,
    queryClient,
  };
};

export default renderComponent;
