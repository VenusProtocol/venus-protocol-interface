import { waitFor } from '@testing-library/dom';
import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { useGetAccountTransactionHistory, useGetSpokePools } from 'clients/api';
import { TX_TYPES } from 'constants/marketTxTypes';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { type Mock, vi } from 'vitest';
import { Transactions } from '..';

vi.mock('clients/api', async () => {
  const { liquidityHubs } = await import('__mocks__/models/liquidityHubs');
  const { poolData } = await import('__mocks__/models/pools');
  const { transactions } = await import('__mocks__/models/transactions');

  return {
    useGetAccountTransactionHistory: vi.fn(() => ({
      data: transactions,
      isLoading: false,
    })),
    useGetLiquidityHubs: vi.fn(() => ({
      data: {
        liquidityHubs,
      },
      isLoading: false,
    })),
    useGetPools: vi.fn(() => ({
      data: {
        pools: poolData,
      },
      isLoading: false,
    })),
    useGetSpokePools: vi.fn(() => ({
      data: undefined,
      isLoading: false,
    })),
  };
});

describe('Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) =>
        name === 'transactionHistory' || name === 'liquidityHub',
    );
  });

  it('displays content correctly', async () => {
    const { container, getByText } = renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() =>
      expect(
        getByText(
          `${en.account.transactions.txType.mint} • ${en.account.transactions.txSource.liquidityHub}`,
        ),
      ),
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('fetches all supported transaction types by default', () => {
    renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
    });

    expect(useGetAccountTransactionHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        types: TX_TYPES,
      }),
      expect.any(Object),
    );
  });

  it('fetches only the selected transaction type', () => {
    renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/?txType=borrow'],
    });

    expect(useGetAccountTransactionHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        types: ['borrow'],
      }),
      expect.any(Object),
    );
  });

  it('displays placeholder when there are no transactions to display', async () => {
    (useGetAccountTransactionHistory as Mock).mockImplementation(() => ({
      data: {
        count: 0,
        transactions: [],
      },
      isLoading: false,
    }));
    const { container } = renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
    });

    expect(container.textContent).toMatchSnapshot();
  });

  it.each([
    ['borrow', ['borrow'], 'core'],
    ['spoke-borrow', ['borrow'], 'spoke'],
    ['hubSupply', ['hubSupply'], undefined],
  ])('filters %s by pool type when Spoke is enabled', (txType, types, poolType) => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) =>
        name === 'transactionHistory' || name === 'liquidityHub' || name === 'spoke',
    );

    renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: [`/?txType=${txType}`],
    });

    expect(useGetAccountTransactionHistory).toHaveBeenLastCalledWith(
      expect.objectContaining({ types, poolType }),
      expect.any(Object),
    );
  });

  it('does not filter by pool type when Spoke is disabled', () => {
    renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: ['/?txType=borrow'],
    });

    expect(useGetAccountTransactionHistory).toHaveBeenLastCalledWith(
      expect.objectContaining({ types: ['borrow'], poolType: undefined }),
      expect.any(Object),
    );
  });

  it('accepts a Spoke market as the source filter', async () => {
    (useGetSpokePools as Mock).mockImplementation(() => ({
      data: { spokePools },
      isLoading: false,
    }));
    const spokeVTokenAddress = spokePools[0].assets[0].vToken.address;

    renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: [`/?contractAddress=${spokeVTokenAddress}`],
    });

    await waitFor(() =>
      expect(useGetAccountTransactionHistory).toHaveBeenLastCalledWith(
        expect.objectContaining({
          contractAddress: spokeVTokenAddress,
        }),
        expect.any(Object),
      ),
    );
  });
});
