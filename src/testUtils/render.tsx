import { render as renderComponentTl } from '@testing-library/react';
import { renderHook as renderHookTl } from '@testing-library/react-hooks';
import { getDefaultProvider } from 'ethers';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChainId } from 'types';

import { Web3Wrapper } from 'clients/web3';
import { AuthContext, AuthContextValue } from 'context/AuthContext';
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
  authContextValue?: Partial<AuthContextValue>;
  routerOpts?: {
    routerInitialEntries: string[];
    routePath: string;
  };
}

interface WrapperProps {
  queryClient: QueryClient;
  children?: React.ReactNode;
  options?: Options;
}

const Wrapper: React.FC<WrapperProps> = ({ children, queryClient, options }) => {
  const defaultAuthContextValues: AuthContextValue = {
    login: vi.fn(),
    logOut: vi.fn(),
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    switchChain: vi.fn(),
    provider: getDefaultProvider(),
    chainId: ChainId.BSC_TESTNET,
    ...options?.authContextValue,
    ...options?.routerOpts,
  };

  return (
    <Web3Wrapper>
      <QueryClientProvider client={queryClient}>
        <MuiThemeProvider>
          <AuthContext.Provider value={defaultAuthContextValues}>
            <MemoryRouter initialEntries={options?.routerOpts?.routerInitialEntries || ['/']}>
              <Routes>
                <Route path={options?.routerOpts?.routePath || '/'} element={children} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </MuiThemeProvider>
      </QueryClientProvider>
    </Web3Wrapper>
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
