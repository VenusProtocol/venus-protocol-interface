import { fireEvent } from '@testing-library/react';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import transactions from '__mocks__/models/transactions';
import { renderComponent } from 'testUtils/render';

import { useGetTransactions } from 'clients/api';

import History from '.';

describe('pages/History', () => {
  beforeEach(() => {
    (useGetTransactions as Vi.Mock).mockImplementation(() => ({
      data: { transactions, total: 120 },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<History />);
  });

  it('fetches transaction on mount', async () => {
    renderComponent(<History />, {
      routerInitialEntries: ['/?page=1'],
      routePath: '/',
    });
    expect(useGetTransactions).toBeCalledTimes(1);
    expect(useGetTransactions).toBeCalledWith({ from: undefined, event: undefined, page: 0 });
  });

  it('rerequests when toggling event filter', async () => {
    const { container } = renderComponent(<History />, {
      routerInitialEntries: ['/?page=1'],
      routePath: '/',
    });
    // Firing the change event on the input for select
    fireEvent.change(container.querySelector('input') as HTMLInputElement, {
      target: {
        value: 'Mint',
      },
    });
    expect(useGetTransactions).toBeCalledTimes(2);
    expect(useGetTransactions).toBeCalledWith({ from: undefined, event: 'Mint', page: 0 });
  });

  it('rerequests when toggling addressFilter', async () => {
    const { getByRole } = renderComponent(<History />, {
      accountAddress: fakeAddress,
      routerInitialEntries: ['/?page=1'],
      routePath: '/',
    });
    const myAddressCheckbox = getByRole('checkbox');
    fireEvent.click(myAddressCheckbox);
    expect(useGetTransactions).toBeCalledTimes(2);
    expect(useGetTransactions).toBeCalledWith({ from: fakeAddress, event: undefined, page: 0 });
  });

  it('address filter is hidden with no wallet connected', async () => {
    const { queryByRole } = renderComponent(<History />);
    const myAddressCheckbox = queryByRole('checkbox');
    expect(myAddressCheckbox).toBe(null);
  });

  it('rerequests when paginating', async () => {
    const { getByText } = renderComponent(<History />, {
      routerInitialEntries: ['/?page=1'],
      routePath: '/',
    });
    const pageTwoButton = getByText('2');
    fireEvent.click(pageTwoButton);
    expect(useGetTransactions).toBeCalledTimes(2);
    expect(useGetTransactions).toBeCalledWith({ from: undefined, event: undefined, page: 1 });
  });
});
