import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as renderComponentTl } from '@testing-library/react';
import { renderHook as renderHookTl } from '@testing-library/react-hooks';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type Vi from 'vitest';

import fakeSigner from '__mocks__/models/signer';

import { Web3Wrapper, useAccountAddress, useChainId, useSigner } from 'libs/wallet';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';
import type { ChainId } from 'types';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

interface Options {
  accountAddress?: string;
  chainId?: ChainId;
  routerInitialEntries?: string[];
  routePath?: string;
  queryClient?: QueryClient;
}

interface WrapperProps {
  children?: React.ReactNode;
  options?: Partial<Options>;
}

const Wrapper: React.FC<WrapperProps> = ({ children, options }) => {
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
      <QueryClientProvider client={options?.queryClient || createQueryClient()}>
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

export const renderComponent = (children: ReactElement, options?: Partial<Options>) =>
  renderComponentTl(children, {
    wrapper: props => <Wrapper options={options} {...props} />,
  });

export const renderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: Partial<Options>,
) =>
  renderHookTl(hook, {
    wrapper: props => <Wrapper options={options} {...props} />,
  });
