import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';
import { ChainId } from 'types';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { poolData } from '__mocks__/models/pools';
import fakeProvider from '__mocks__/models/provider';
import { useGetMainPool } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import Withdraw from '.';

describe('Withdraw', () => {
  beforeEach(() => {
    (useGetMainPool as Vi.Mock).mockImplementation(() => ({
      data: {
        pool: {
          ...poolData[0],
          userTotalBorrowLimit: new BigNumber('111'),
          userTotalBorrowBalance: new BigNumber('91'),
          userTotalSupplyBalance: new BigNumber('910'),
        },
      },
      isLoading: false,
    }));
  });

  it('submit button is enabled with input, good vesting period and not loading', async () => {
    const withdrawXvs = vi.fn().mockReturnValue(fakeContractTransaction);
    const { getByText } = renderComponent(
      <AuthContext.Provider
        value={{
          login: vi.fn(),
          logOut: vi.fn(),
          openAuthModal: vi.fn(),
          closeAuthModal: vi.fn(),
          provider: fakeProvider,
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
        }}
      >
        <Withdraw
          xvsWithdrawableAmount={new BigNumber(9999)}
          withdrawXvs={withdrawXvs}
          withdrawXvsLoading={false}
        />
      </AuthContext.Provider>,
    );
    const submitButton = getByText(en.convertVrt.withdrawXvs).closest(
      'button',
    ) as HTMLButtonElement;
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(withdrawXvs).toHaveBeenCalledTimes(1));
  });
});
