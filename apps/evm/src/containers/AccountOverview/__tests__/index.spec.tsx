import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { spokePools } from '__mocks__/models/spokePools';
import { vaults } from '__mocks__/models/vaults';
import { useGetLiquidityHubs, useGetPool, useGetSpokePools, useGetVaults } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import * as storeModule from 'store';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { AccountOverview } from '..';
import { testIds } from '../testIds';

vi.mock('hooks/useUserChainSettings');

describe('AccountOverview', () => {
  it('displays correctly when user is not connected', async () => {
    const { container } = renderComponent(<AccountOverview />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays correctly when user is connected', async () => {
    const { container, queryByTestId } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    expect(container.textContent).toMatchSnapshot();
  });

  it('adds Spoke positions to the net worth', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: { name: string }) => name === 'spoke',
    );
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        spokePools: [
          {
            ...spokePools[0],
            userSupplyBalanceCents: new BigNumber(1_200_000_000_000),
            userBorrowBalanceCents: new BigNumber(200_000_000_000),
          },
        ],
      },
    }));

    const { container, queryByTestId } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    expect(container.textContent).toContain(`${en.dashboard.overview.netWorth.label}$10B`);
  });

  it('adds Spoke positions to the account summary', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: { name: string }) => name === 'spoke',
    );
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        spokePools: [
          {
            ...spokePools[0],
            userSupplyBalanceCents: new BigNumber(1_200_000_000_000),
            userBorrowBalanceCents: new BigNumber(200_000_000_000),
            userYearlyEarningsCents: new BigNumber(-36_500_000_000),
          },
        ],
      },
    }));

    const { container, queryByTestId, getByText } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    fireEvent.click(getByText(en.dashboard.overview.absolutePerformance).closest('button')!);

    const { cellGroup } = en.dashboard.overview.summary;
    expect(container.textContent).toContain(`${cellGroup.totalSupply}$12B`);
    expect(container.textContent).toContain(`${cellGroup.totalBorrow}$2B`);
    expect(container.textContent).toContain(`${cellGroup.dailyEarnings}-$999.99K`);
    expect(container.textContent).toContain(`${cellGroup.netApy}-3.04%`);
  });

  it('waits for the Spoke positions before showing the net worth', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: { name: string }) => name === 'spoke',
    );
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: true,
      data: undefined,
    }));

    const { container, queryByTestId } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    expect(container.textContent).toContain(`${en.dashboard.overview.netWorth.label}-`);
  });

  it('does not show a net worth when the Spoke positions could not be read', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: { name: string }) => name === 'spoke',
    );
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: false,
      data: { spokePools: [{ ...spokePools[0], isUserDataUnavailable: true }] },
    }));

    const { container, queryByTestId } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    expect(container.textContent).toContain(`${en.dashboard.overview.netWorth.label}-`);
  });

  it('displays correctly when user is connected and accordion is expanded', async () => {
    const { container, queryByTestId, getByText } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    // Expand accordion
    fireEvent.click(getByText(en.dashboard.overview.absolutePerformance).closest('button')!);

    expect(container.textContent).toMatchSnapshot();
  });

  it('hides user balances when doNotShowUserBalances setting is true', async () => {
    const mockSetUserSettings = vi.fn();

    vi.mocked(useUserChainSettings).mockReturnValue([
      { ...defaultUserChainSettings, doNotShowUserBalances: true },
      vi.fn(),
    ]);

    vi.spyOn(storeModule, 'useStore').mockImplementation((selector: any) =>
      selector({
        userSettings: {},
        setUserSettings: mockSetUserSettings,
      }),
    );

    const { container, queryAllByRole } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();

    const toggleBalancesButton = queryAllByRole('button').find(
      button => !button.hasAttribute('disabled'),
    );

    if (!toggleBalancesButton) {
      throw new Error('Expected balance visibility toggle button to be enabled');
    }

    fireEvent.click(toggleBalancesButton);

    expect(mockSetUserSettings).toHaveBeenCalledTimes(1);
    expect(mockSetUserSettings.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "settings": {
            "doNotShowUserBalances": false,
          },
        },
      ]
    `);
  });

  it('holds back the account figures until both balance queries have settled', async () => {
    (useGetVaults as Mock).mockImplementation(() => ({ isLoading: true, data: undefined }));

    const { queryByText, rerender } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      { accountAddress: fakeAccountAddress },
    );

    await waitFor(() =>
      expect(queryByText(en.dashboard.overview.netWorth.label)).toBeInTheDocument(),
    );
    expect(queryByText('$1.24M')).not.toBeInTheDocument();

    (useGetVaults as Mock).mockImplementation(() => ({ isLoading: false, data: vaults }));

    rerender(<AccountOverview accountAddress={fakeAccountAddress} />);

    await waitFor(() => expect(queryByText('$1.24M')).toBeInTheDocument());
  });

  it('counts only the wallet part of Liquidity Hub deposits in the net worth figure', async () => {
    const hubSupplyCents = new BigNumber(50000);

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: {
          ...poolData[0],
          userSupplyBalanceCents: new BigNumber(0),
          userBorrowBalanceCents: new BigNumber(0),
          vai: undefined,
        },
      },
    }));
    (useGetVaults as Mock).mockImplementation(() => ({ isLoading: false, data: [] }));
    (useGetLiquidityHubs as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        liquidityHubs: [
          {
            ...liquidityHubs[0],
            userSupplyBalanceCents: hubSupplyCents.multipliedBy(3),
            userVhTokenBalanceCents: hubSupplyCents,
          },
        ],
      },
    }));

    const { queryByText } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      { accountAddress: fakeAccountAddress },
    );

    await waitFor(() => expect(queryByText('$500')).toBeInTheDocument());
  });

  it('counts Liquidity Hub deposits and Spoke positions together in the net worth', async () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: { name: string }) => name === 'spoke' || name === 'liquidityHub',
    );
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: {
          ...poolData[0],
          userSupplyBalanceCents: new BigNumber(0),
          userBorrowBalanceCents: new BigNumber(0),
          vai: undefined,
        },
      },
    }));
    (useGetVaults as Mock).mockImplementation(() => ({ isLoading: false, data: [] }));
    (useGetLiquidityHubs as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        liquidityHubs: [{ ...liquidityHubs[0], userVhTokenBalanceCents: new BigNumber(50000) }],
      },
    }));
    (useGetSpokePools as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        spokePools: [
          {
            ...spokePools[0],
            userSupplyBalanceCents: new BigNumber(100000),
            userBorrowBalanceCents: new BigNumber(20000),
          },
        ],
      },
    }));

    const { container, queryByTestId } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      { accountAddress: fakeAccountAddress },
    );

    await waitFor(() => expect(queryByTestId(testIds.performanceChartPreview)).toBeInTheDocument());

    expect(container.textContent).toContain(`${en.dashboard.overview.netWorth.label}$1.3K`);
  });

  it('holds back the account figures when the Hub balances fail to load', async () => {
    (useGetLiquidityHubs as Mock).mockImplementation(() => ({
      isLoading: false,
      isLoadingError: true,
      data: undefined,
    }));

    const { queryByText } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() =>
      expect(queryByText(en.dashboard.overview.netWorth.label)).toBeInTheDocument(),
    );

    expect(queryByText('$1.24M')).not.toBeInTheDocument();
    expect(queryByText('$1.23M')).not.toBeInTheDocument();
  });

  it('keeps showing the net worth when a refetch fails but balances are cached', async () => {
    (useGetLiquidityHubs as Mock).mockImplementation(() => ({
      isLoading: false,
      isLoadingError: false,
      isError: true,
      data: { liquidityHubs },
    }));

    const { queryByText } = renderComponent(
      <AccountOverview accountAddress={fakeAccountAddress} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByText('$1.24M')).toBeInTheDocument());
  });
});
