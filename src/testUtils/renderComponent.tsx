// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import { getDefaultProvider } from 'ethers';
import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ChainId } from 'types';

import { Web3Wrapper } from 'clients/web3';
import { AuthContext, AuthContextValue } from 'context/AuthContext';
import { DisableLunaUstWarningProvider } from 'context/DisableLunaUstWarning';
import { SuccessfulTransactionModalProvider } from 'context/SuccessfulTransactionModalContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

const renderComponent = (
  children: ReactElement,
  {
    authContextValue = {},
    routerOpts = {
      routerInitialEntries: ['/'],
      routePath: '/',
    },
  }: {
    authContextValue?: Partial<AuthContextValue>;
    routerOpts?: {
      routerInitialEntries: string[];
      routePath: string;
    };
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

  const defaultAuthContextValues: AuthContextValue = {
    login: vi.fn(),
    logOut: vi.fn(),
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    provider: getDefaultProvider(),
    chainId: ChainId.BSC_TESTNET,
    ...authContextValue,
    ...routerOpts,
  };

  const renderRes = render(
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthContext.Provider value={defaultAuthContextValues}>
            <SuccessfulTransactionModalProvider>
              <DisableLunaUstWarningProvider>
                <MemoryRouter initialEntries={routerOpts.routerInitialEntries}>
                  <ToastContainer />

                  <Routes>
                    <Route path={routerOpts.routePath} element={children} />
                  </Routes>
                </MemoryRouter>
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
