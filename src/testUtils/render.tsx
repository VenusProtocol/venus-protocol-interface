import { render as renderComponentTl } from '@testing-library/react';
import { renderHook as renderHookTl } from '@testing-library/react-hooks';
import { Web3Wrapper, useAccountAddress, useChainId } from 'packages/wallet';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChainId } from 'types';
import Vi from 'vitest';

import { AuthContext } from 'context/AuthContext';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

interface Options {
  authContextValue?: {
    accountAddress?: string;
    chainId?: ChainId;
  };
  routerOpts?: {
    routerInitialEntries?: string[];
    routePath?: string;
  };
}

interface WrapperProps {
  queryClient: QueryClient;
  children?: React.ReactNode;
  options?: Options;
}

const Wrapper: React.FC<WrapperProps> = ({ children, queryClient, options }) => {
  if (options?.authContextValue?.accountAddress) {
    (useAccountAddress as Vi.Mock).mockImplementation(() => ({
      accountAddress: options?.authContextValue?.accountAddress,
    }));
  }

  if (options?.authContextValue?.chainId) {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: options?.authContextValue?.chainId,
    }));
  }

  // TODO: remove
  const defaultAuthContextValues = {
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    switchChain: vi.fn(),
    chainId: ChainId.BSC_TESTNET,
    ...options?.authContextValue,
  };

  return (
    <MuiThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Web3Wrapper>
          <AuthContext.Provider value={defaultAuthContextValues}>
            <MemoryRouter initialEntries={options?.routerOpts?.routerInitialEntries || ['/']}>
              <Routes>
                <Route path={options?.routerOpts?.routePath || '/'} element={children} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </Web3Wrapper>
      </QueryClientProvider>
    </MuiThemeProvider>
  );
};

export const renderComponent = (children: ReactElement, options?: Options) => {
  const queryClient = createQueryClient();

  const renderRes = renderComponentTl(children, {
    wrapper: props => <Wrapper queryClient={queryClient} options={options} {...props} />,
  });

  return {
    ...renderRes,
    queryClient,
  };
};

export const renderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: Options,
) => {
  const queryClient = createQueryClient();

  const renderRes = renderHookTl(hook, {
    wrapper: props => <Wrapper queryClient={queryClient} options={options} {...props} />,
  });

  return {
    ...renderRes,
    queryClient,
  };
};
