import { waitFor } from '@testing-library/dom';
import fakeAccountAddress from '__mocks__/models/address';
import { useGetAccountTransactionHistory } from 'clients/api';
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
});
