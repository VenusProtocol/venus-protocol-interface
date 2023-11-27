import { render as renderComponentTl } from '@testing-library/react';
import { renderHook as renderHookTl } from '@testing-library/react-hooks';
import { Web3Wrapper, useAccountAddress, useChainId, useSigner } from 'packages/wallet';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeSigner from '__mocks__/models/signer';
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
  accountAddress?: string;
  chainId?: ChainId;
  routerInitialEntries?: string[];
  routePath?: string;
}

interface WrapperProps {
  queryClient: QueryClient;
  children?: React.ReactNode;
  options?: Options;
}

const Wrapper: React.FC<WrapperProps> = ({ children, queryClient, options }) => {
  if (options?.accountAddress) {
    const accountAddress = options?.accountAddress;

    (useAccountAddress as Vi.Mock).mockImplementation(() => ({
      accountAddress,
    }));

    (useSigner as Vi.Mock).mockImplementation(() => ({
      signer: {
        ...fakeSigner,
        getAddress: async () => accountAddress,
      },
    }));
  }

  if (options?.chainId) {
    (useChainId as Vi.Mock).mockImplementation(() => ({
      chainId: options?.chainId,
    }));
  }

  return (
    <MuiThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Web3Wrapper>
          <MemoryRouter initialEntries={options?.routerInitialEntries || ['/']}>
            <Routes>
              <Route path={options?.routePath || '/'} element={children} />
            </Routes>
          </MemoryRouter>
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
