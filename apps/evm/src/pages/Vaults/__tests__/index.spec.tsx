import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useLocation } from 'react-router';
import type { Mock } from 'vitest';

import { institutionalVault, pendleBnbVault, vaults as venusVaults } from '__mocks__/models/vaults';
import { en, t } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { type InstitutionalVault, VaultStatus } from 'types';

import { useGetVaults } from 'clients/api';

import VaultsPage from '..';

describe('Vaults', () => {
  const fakeVaults = [institutionalVault, ...venusVaults];
  const titleSelector = 'p.truncate.text-b1s';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-05T00:00:00.000Z'));

    (useGetVaults as Mock).mockImplementation(() => ({
      data: fakeVaults,
      isLoading: false,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders vaults correctly', () => {
    const { getByText } = renderComponent(<VaultsPage />);

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(
      getByText(t('vault.timeline.textualWithTime', { date: institutionalVault.openEndDate })),
    ).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
  });

  it('renders vaults in priority order', () => {
    const [vaiVault, xvsVault] = venusVaults;

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [xvsVault, vaiVault, institutionalVault, pendleBnbVault],
      isLoading: false,
    }));

    const { container } = renderComponent(<VaultsPage />);
    const vaultTitles = Array.from(container.querySelectorAll(titleSelector)).map(
      element => element.textContent,
    );

    expect(vaultTitles).toEqual([
      pendleBnbVault.stakedToken.symbol,
      t('vault.card.header.fixedTermTitle', {
        tokenSymbol: institutionalVault.stakedToken.symbol,
      }),
      vaiVault.stakedToken.symbol,
      xvsVault.stakedToken.symbol,
    ]);
  });

  it('filters vaults from the url venue parameter', () => {
    const { getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?venue=institution'],
    });

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults from the url category parameter', () => {
    const { getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=governance'],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('MATRIXDOCK')).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('filters vaults by token symbol search', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderComponent(<VaultsPage />);

    fireEvent.change(getByPlaceholderText(en.vault.filter.inputPlaceholder), {
      target: { value: 'xvs' },
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('MATRIXDOCK')).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('excludes Venus vaults from the supply status', () => {
    const { queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?status=deposit'],
    });

    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('keeps Venus vaults reachable under the paused status', () => {
    const pausedVenusVault = {
      ...venusVaults[0],
      isPaused: true,
      status: VaultStatus.Paused,
    };

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [institutionalVault, pausedVenusVault],
      isLoading: false,
    }));

    const { getByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?status=paused'],
    });

    expect(
      getByText(pausedVenusVault.stakedToken.symbol, { selector: titleSelector }),
    ).toBeInTheDocument();
  });

  it('redirects the legacy active status parameter to the supply status', () => {
    const { queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?status=active'],
    });

    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('rewrites the legacy active status parameter in the url', async () => {
    const SearchDisplay = () => <div data-testid="search">{useLocation().search}</div>;

    renderComponent(
      <>
        <VaultsPage />

        <SearchDisplay />
      </>,
      { routerInitialEntries: ['/?status=active'] },
    );

    await waitFor(() =>
      expect(screen.getByTestId('search')).toHaveTextContent(`status=${VaultStatus.Deposit}`),
    );
  });

  it('filters vaults from the url status parameter', () => {
    const liquidatedInstitutionalVault = {
      ...institutionalVault,
      status: VaultStatus.Liquidated,
    } satisfies InstitutionalVault;

    (useGetVaults as Mock).mockImplementation(() => ({
      data: [liquidatedInstitutionalVault, ...venusVaults],
      isLoading: false,
    }));

    const { getAllByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?status=liquidated'],
    });

    expect(getAllByText(en.vault.filter.liquidated)).toHaveLength(2);
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it.each([
    ['an empty status parameter', '/?status='],
    ['an unknown status parameter', '/?status=not-a-real-state'],
  ])('falls back to all states with %s', (_label, initialEntry) => {
    const { getByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: [initialEntry],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(
      getByText(
        t('vault.card.header.fixedTermTitle', {
          tokenSymbol: institutionalVault.stakedToken.symbol,
        }),
        { selector: titleSelector },
      ),
    ).toBeInTheDocument();
  });
});
