import React from 'react';
import { fireEvent } from '@testing-library/react';
import renderComponent from 'testUtils/renderComponent';
import { useGetTransactions } from 'clients/api';
import transactions from '__mocks__/models/transactions';
import fakeAddress from '__mocks__/models/address';
import { SPINNER_TEST_ID } from 'components';
import History from '.';

jest.mock('clients/api');

describe('pages/History', () => {
  beforeEach(() => {
    (useGetTransactions as jest.Mock).mockImplementation(() => ({
      data: { transactions, total: 120 },
      isLoading: false,
    }));
  });

  it('renders without crashing', async () => {
    renderComponent(<History />);
  });

  it('fetches transaction on mount', async () => {
    renderComponent(<History />);
    expect(useGetTransactions).toBeCalledTimes(1);
    expect(useGetTransactions).toBeCalledWith({ address: undefined, event: undefined, page: 1 });
  });

  it('renders spinner when fetching', async () => {
    (useGetTransactions as jest.Mock).mockImplementation(() => {
      setTimeout(() => {}, 5000);
      return {
        data: undefined,
        isFetching: true,
      };
    });
    const { getByTestId } = renderComponent(<History />);
    getByTestId(SPINNER_TEST_ID);
  });

  it('rerequests when toggling event filter', async () => {
    const { container } = renderComponent(<History />);
    // Firing the change event on the input for select
    fireEvent.change(container.querySelector('input') as HTMLInputElement, {
      target: {
        value: 'Mint',
      },
    });
    expect(useGetTransactions).toBeCalledTimes(2);
    expect(useGetTransactions).toBeCalledWith({ address: undefined, event: 'Mint', page: 1 });
  });

  it('rerequests when toggling addressFilter', async () => {
    const { getByRole } = renderComponent(<History />, {
      authContextValue: { account: { address: fakeAddress } },
    });
    const myAddressCheckbox = getByRole('checkbox');
    fireEvent.click(myAddressCheckbox);
    expect(useGetTransactions).toBeCalledTimes(2);
    expect(useGetTransactions).toBeCalledWith({ address: fakeAddress, event: undefined, page: 1 });
  });

  it('address filter is hidden with no wallet connected', async () => {
    const { queryByRole } = renderComponent(<History />);
    const myAddressCheckbox = queryByRole('checkbox');
    expect(myAddressCheckbox).toBe(null);
  });

  it('rerequests when paginating', async () => {
    const { getByText } = renderComponent(<History />);
    const pageTwoButton = getByText('2');
    fireEvent.click(pageTwoButton);
    expect(useGetTransactions).toBeCalledTimes(2);
    expect(useGetTransactions).toBeCalledWith({ address: undefined, event: undefined, page: 2 });
  });
});
