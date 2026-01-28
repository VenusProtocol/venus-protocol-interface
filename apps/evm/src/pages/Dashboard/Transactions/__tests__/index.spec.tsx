import { waitFor } from '@testing-library/dom';
import fakeAccountAddress from '__mocks__/models/address';
import { useGetAccountTransactionHistory } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { Transactions } from '..';

describe('Transactions', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'transactionHistory',
    );
  });

  it('displays content correctly', async () => {
    const { container, getByText } = renderComponent(<Transactions />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => expect(getByText(en.dashboard.transactions.txType.mint)));

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
