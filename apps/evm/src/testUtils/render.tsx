import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as renderComponentTl } from '@testing-library/react';
import { renderHook as renderHookTl } from '@testing-library/react-hooks';
import type { ReactElement } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Mock } from 'vitest';

import fakeSigner from '__mocks__/models/signer';

import {
  Web3Wrapper,
  useAccountAddress,
  useAccountChainId,
  useChainId,
  useSigner,
} from 'libs/wallet';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';
import { ChainId } from 'types';

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
  accountChainId?: ChainId;
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
  const chainId = options?.chainId || ChainId.BSC_TESTNET;

  if (options?.accountAddress) {
    const accountAddress = options?.accountAddress;

    (useAccountAddress as Mock).mockImplementation(() => ({
      accountAddress,
    }));

    (useAccountChainId as Mock).mockImplementation(() => ({
      chainId: options?.accountChainId || chainId,
    }));

    (useSigner as Mock).mockImplementation(() => ({
      signer: {
        ...fakeSigner,
        getAddress: async () => accountAddress,
      },
    }));
  }

  (useChainId as Mock).mockImplementation(() => ({
    chainId,
  }));

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
