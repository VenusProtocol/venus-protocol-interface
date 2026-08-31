import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useLocation, useNavigationType } from 'react-router';
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

  // A filter label can also appear on the vault cards, and an open dropdown renders its
  // options in both the desktop menu and the mobile modal. The trigger is always the first
  // button carrying the label, and the modal copy of an option always the last one.
  const getFilterTrigger = (label: string) => screen.getAllByRole('button', { name: label })[0];
  const getFilterOption = (label: string) => screen.getAllByRole('button', { name: label }).at(-1)!;

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

  it('lists Venus vaults under the supply status', () => {
    const { getAllByText, getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?status=deposit'],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getAllByText(en.vault.filter.deposit)).toHaveLength(3);
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
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
    const { getAllByText, getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?status=active'],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getAllByText(en.vault.filter.deposit)).toHaveLength(3);
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
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
    ['mixed with another state', '/?status=active,pending', 'deposit,pending'],
    ['duplicated by its modern value', '/?status=active,deposit', 'deposit'],
    ['listed after another state', '/?status=pending,active', 'deposit,pending'],
  ])(
    'rewrites the legacy active status parameter when %s',
    async (_label, initialEntry, expected) => {
      const SearchDisplay = () => <div data-testid="search">{useLocation().search}</div>;

      renderComponent(
        <>
          <VaultsPage />

          <SearchDisplay />
        </>,
        { routerInitialEntries: [initialEntry] },
      );

      await waitFor(() =>
        expect(
          new URLSearchParams(screen.getByTestId('search').textContent ?? '').get('status'),
        ).toBe(expected),
      );
    },
  );

  it('persists every selected value of a group in the url', () => {
    const SearchDisplay = () => <div data-testid="search">{useLocation().search}</div>;

    renderComponent(
      <>
        <VaultsPage />

        <SearchDisplay />
      </>,
      { routerInitialEntries: [`/?status=${VaultStatus.Pending}`] },
    );

    fireEvent.click(getFilterTrigger(en.vault.filter.pending));
    fireEvent.click(getFilterOption(en.vault.filter.deposit));

    expect(
      new URLSearchParams(screen.getByTestId('search').textContent ?? '').get('status'),
      // Serialized in the order the options are displayed, not the order they were picked
    ).toBe(`${VaultStatus.Deposit},${VaultStatus.Pending}`);
  });

  it('combines values within a group with OR', () => {
    const { getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: [`/?status=${VaultStatus.Deposit},${VaultStatus.Pending}`],
    });

    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();

    // The trigger reflects the two selected states rather than either label
    expect(getByText(t('vault.filter.nStates', { count: 2 }))).toBeInTheDocument();
    expect(queryByText(en.vault.filter.allStates)).not.toBeInTheDocument();
  });

  it('combines groups with AND', () => {
    const { getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=stablecoins&venue=venus'],
    });

    // VAI is the only stablecoins vault hosted on the Venus venue
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
  });

  it('ignores unknown values within a group', () => {
    const { getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?venue=institution,not-a-real-venue'],
    });

    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
  });

  it('labels a trigger with the selected option when a group holds a single value', () => {
    const { getByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=governance'],
    });

    expect(getFilterTrigger(en.vault.category.governance)).toBeInTheDocument();
    expect(getByText(en.vault.filter.allVenues)).toBeInTheDocument();
    expect(getByText(en.vault.filter.allStates)).toBeInTheDocument();
  });

  it('lets user select several values from a group', () => {
    const { getByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=governance'],
    });

    fireEvent.click(getFilterTrigger(en.vault.category.governance));
    fireEvent.click(getFilterOption(en.vault.category.stablecoins));

    expect(getByText(t('vault.filter.nCategories', { count: 2 }))).toBeInTheDocument();
    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
  });

  it('lets user clear a single group from its reset link', () => {
    const { getAllByText, getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=governance&venue=venus'],
    });

    fireEvent.click(getFilterTrigger(en.vault.category.governance));
    fireEvent.click(getAllByText(en.vault.filter.reset)[0]);

    expect(getByText(en.vault.filter.allCategories)).toBeInTheDocument();
    // The venue group is left untouched, so the institutional vault stays filtered out
    expect(queryByText(en.vault.filter.allVenues)).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
  });

  it('replaces the history entry when a filter changes', () => {
    const NavigationTypeDisplay = () => (
      <div data-testid="navigation-type">{useNavigationType()}</div>
    );

    renderComponent(
      <>
        <VaultsPage />

        <NavigationTypeDisplay />
      </>,
    );

    fireEvent.click(getFilterTrigger(en.vault.filter.allCategories));
    fireEvent.click(getFilterOption(en.vault.category.governance));

    expect(screen.getByTestId('navigation-type')).toHaveTextContent('REPLACE');
  });

  it('shows the no results state when no vault matches the filters', () => {
    const { getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=governance&venue=institution'],
    });

    expect(getByText(en.vault.filter.noResults)).toBeInTheDocument();
    expect(queryByText('XVS', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText('VAI', { selector: titleSelector })).not.toBeInTheDocument();
    expect(queryByText(en.vault.modals.depositPeriodEnds)).not.toBeInTheDocument();
  });

  it('clears every group and the search field from the no results state', () => {
    const { getByPlaceholderText, getByText, queryByText } = renderComponent(<VaultsPage />, {
      routerInitialEntries: ['/?category=governance'],
    });

    const searchInput = getByPlaceholderText(en.vault.filter.inputPlaceholder);
    fireEvent.change(searchInput, { target: { value: 'vai' } });

    expect(getByText(en.vault.filter.noResults)).toBeInTheDocument();

    fireEvent.click(getByText(en.vault.filter.resetFilters));

    expect(queryByText(en.vault.filter.noResults)).not.toBeInTheDocument();
    expect(searchInput).toHaveValue('');
    expect(getByText(en.vault.filter.allCategories)).toBeInTheDocument();
    expect(getByText('XVS', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText('VAI', { selector: titleSelector })).toBeInTheDocument();
    expect(getByText(en.vault.modals.depositPeriodEnds)).toBeInTheDocument();
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
