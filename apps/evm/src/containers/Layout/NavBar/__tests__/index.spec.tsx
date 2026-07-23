vi.unmock('clients/api');
vi.unmock('hooks/useGetContractAddress');
vi.unmock('hooks/useIsFeatureEnabled');
vi.unmock('hooks/useSendTransaction');
vi.unmock('hooks/useUserChainSettings');
vi.unmock('libs/analytics');
vi.unmock('libs/tokens');
vi.unmock('libs/wallet');
vi.unmock('zustand');

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { MuiThemeProvider } from 'App/MuiThemeProvider';
import FunctionKey from 'constants/functionKey';
import { PAGE_CONTAINER_ID } from 'constants/layout';
import { Web3Wrapper } from 'libs/wallet';
import walletConfig from 'libs/wallet/Web3Wrapper/config';
import type { ChainId } from 'types';

import { useStore } from 'containers/Layout/store';
import { NavBar } from '..';

const defaultChainId = walletConfig.chains[0]?.id as ChainId;
const connectedAccountAddress = '0x1111111111111111111111111111111111111111' as const;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: 0,
      },
    },
  });

const resetWalletState = () => {
  walletConfig.setState({
    chainId: defaultChainId,
    connections: new Map(),
    current: null,
    status: 'disconnected',
  });
};

const setConnectedWalletState = () => {
  const connector = walletConfig.connectors[0];

  walletConfig.setState({
    chainId: defaultChainId,
    connections: new Map([
      [
        connector.uid,
        {
          accounts: [connectedAccountAddress],
          chainId: defaultChainId,
          connector,
        },
      ],
    ]),
    current: connector.uid,
    status: 'connected',
  });
};

const seedSharedQueryData = ({
  queryClient,
  accountAddress,
}: {
  queryClient: QueryClient;
  accountAddress?: string;
}) => {
  queryClient.setQueryData([FunctionKey.GET_POOLS, { accountAddress, chainId: defaultChainId }], {
    pools: [],
    tokenMetadataMapping: {},
  });

  queryClient.setQueryData([FunctionKey.GET_IP_LOCATION], {
    countryCode: 'FR',
  });

  if (!accountAddress) {
    return;
  }

  queryClient.setQueryData([FunctionKey.GET_IS_ADDRESS_AUTHORIZED, { accountAddress }], {
    authorized: true,
  });

  queryClient.setQueryData(
    [FunctionKey.GET_PENDING_REWARDS, { accountAddress, chainId: defaultChainId }],
    {
      pendingRewardGroups: [],
    },
  );

  queryClient.setQueryData(
    [FunctionKey.GET_PRIME_TOKEN, { accountAddress, chainId: defaultChainId }],
    {
      exists: false,
      isIrrevocable: false,
    },
  );
};

const renderNavBar = ({ accountAddress }: { accountAddress?: string } = {}) => {
  const queryClient = createQueryClient();

  seedSharedQueryData({
    queryClient,
    accountAddress,
  });

  return {
    queryClient,
    ...render(
      <MuiThemeProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <Web3Wrapper>
              <Routes>
                <Route path="*" element={<NavBar className="custom-nav" data-testid="nav-bar" />} />
              </Routes>
            </Web3Wrapper>
          </MemoryRouter>
        </QueryClientProvider>
      </MuiThemeProvider>,
    ),
  };
};

describe('NavBar', () => {
  beforeEach(() => {
    resetWalletState();
    useStore.setState({
      isCloseToBottom: false,
      isScrollToTopVisible: false,
      openModal: undefined,
    });
    document.body.className = '';

    const pageContainer = document.createElement('div');
    pageContainer.id = PAGE_CONTAINER_ID;
    document.body.appendChild(pageContainer);
  });

  afterEach(() => {
    document.getElementById(PAGE_CONTAINER_ID)?.remove();
    document.body.className = '';
    useStore.setState({
      isCloseToBottom: false,
      isScrollToTopVisible: false,
      openModal: undefined,
    });
    resetWalletState();
  });

  it('renders the disconnected navigation state with the real component tree', () => {
    const { container } = renderNavBar();

    expect(screen.getByTestId('nav-bar')).toHaveClass('custom-nav');
    expect(screen.getAllByAltText('Venus logo')).toHaveLength(2);
    expect(screen.getAllByText('Dashboard')).toHaveLength(2);
    expect(screen.getAllByText('Markets').length).toBeGreaterThan(1);
    // On testnet the liquidityHub feature is enabled, so Vaults lives inside the "Earn" submenu
    // rather than being a top-level item
    expect(screen.getAllByText('Earn').length).toBeGreaterThan(1);
    expect(screen.getByRole('button', { name: 'Connect wallet' })).toBeInTheDocument();
    expect(container.querySelector('button.hidden.lg\\:flex')).not.toBeNull();
  });

  it('hides the desktop settings button when the user is connected', () => {
    setConnectedWalletState();
    const { container } = renderNavBar({
      accountAddress: connectedAccountAddress,
    });

    expect(screen.queryByText('Connect wallet')).not.toBeInTheDocument();
    expect(container.querySelector('button.hidden.lg\\:flex')).toBeNull();
  });

  it('toggles the mobile menu and page scroll lock', () => {
    const { container } = renderNavBar();

    const pageContainer = document.getElementById(PAGE_CONTAINER_ID) as HTMLDivElement;
    const mobileMenu = screen.getByText('Menu').closest('div')?.parentElement as HTMLDivElement;
    const mobileMenuToggle = container.querySelector('button.size-10') as HTMLButtonElement;
    const logoLink = screen.getAllByAltText('Venus logo')[0].closest('a') as HTMLAnchorElement;

    expect(mobileMenu).toHaveClass('hidden');
    expect(pageContainer).not.toHaveClass('overflow-hidden');
    expect(document.body).not.toHaveClass('overflow-hidden');

    fireEvent.click(mobileMenuToggle);

    expect(mobileMenu).toHaveClass('fixed');
    expect(pageContainer).toHaveClass('overflow-hidden');
    expect(document.body).toHaveClass('overflow-hidden');

    fireEvent.click(logoLink);

    expect(mobileMenu).toHaveClass('hidden');
    expect(pageContainer).not.toHaveClass('overflow-hidden');
    expect(document.body).not.toHaveClass('overflow-hidden');
  });

  it('closes the account modal when the mobile menu is opened', () => {
    setConnectedWalletState();
    const { container } = renderNavBar({
      accountAddress: connectedAccountAddress,
    });

    const mobileMenu = screen.getByText('Menu').closest('div')?.parentElement as HTMLDivElement;
    const mobileMenuToggle = container.querySelector('button.size-10') as HTMLButtonElement;

    act(() => {
      useStore.setState({
        openModal: 'accountModal',
      });
    });

    expect(useStore.getState().openModal).toBe('accountModal');

    fireEvent.click(mobileMenuToggle);

    expect(useStore.getState().openModal).toBe('mobileMenu');
    expect(mobileMenu).toHaveClass('fixed');
  });
});
