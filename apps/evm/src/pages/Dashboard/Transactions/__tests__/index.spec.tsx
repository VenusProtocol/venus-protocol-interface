import { waitFor } from '@testing-library/dom';
import fakeAccountAddress from '__mocks__/models/address';
import { vhXvs } from '__mocks__/models/vhTokens';
import { useGetAccountTransactionHistory } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { Transactions } from '..';

describe('Transactions', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) =>
        name === 'transactionHistory' || name === 'liquidityHub',
    );
  });

  it('includes Liquidity Hub contracts in the source filter', async () => {
    const { getByText } = renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
      routerInitialEntries: [`/?contractAddress=${vhXvs.address}`],
    });

    await waitFor(() =>
      expect(getByText(`XVS - ${en.layouts.menu.markets.liquidityHub.label}`)).toBeInTheDocument(),
    );
  });
  it('displays content correctly', async () => {
    const { container, getByText } = renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => expect(getByText(en.account.transactions.txType.mint)));

    expect(container.textContent).toMatchSnapshot();
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
