import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import toast from 'components/Basic/Toast';
import fakeAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import { AuthContext } from 'context/AuthContext';
import { getXvsReward, claimXvsReward } from 'clients/api';
import ClaimXvsRewardButton, { TEST_ID } from '.';

jest.mock('clients/api');
jest.mock('components/Basic/Toast');

describe('pages/Dashboard/MintRepayVai', () => {
  it('renders without crashing', () => {
    renderComponent(<ClaimXvsRewardButton />);
  });

  it('renders nothing if user have not connected any wallet', () => {
    const { queryAllByTestId } = renderComponent(<ClaimXvsRewardButton />);
    expect(queryAllByTestId(TEST_ID)).toHaveLength(0);
  });

  it('renders nothing if user have no claimable XVS reward', () => {
    const { queryAllByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAddress,
          },
        }}
      >
        <ClaimXvsRewardButton />
      </AuthContext.Provider>,
    );
    expect(queryAllByTestId(TEST_ID)).toHaveLength(0);
  });

  it('renders correct XVS reward when user are connected and have claimable XVS reward', async () => {
    (getXvsReward as jest.Mock).mockImplementationOnce(
      async () => new BigNumber('10000000000000000000000'),
    );

    const { getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAddress,
          },
        }}
      >
        <ClaimXvsRewardButton />
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(getByTestId(TEST_ID)));
    expect(getByTestId(TEST_ID).textContent).toContain('10,000 XVS');
  });

  it('it claims XVS reward on click and displays toast on success', async () => {
    (getXvsReward as jest.Mock).mockImplementationOnce(
      async () => new BigNumber('10000000000000000000000'),
    );

    (claimXvsReward as jest.Mock).mockImplementationOnce(async () => fakeTransactionReceipt);

    const { getByTestId } = renderComponent(
      <AuthContext.Provider
        value={{
          login: jest.fn(),
          logOut: jest.fn(),
          openAuthModal: jest.fn(),
          closeAuthModal: jest.fn(),
          account: {
            address: fakeAddress,
          },
        }}
      >
        <ClaimXvsRewardButton />
      </AuthContext.Provider>,
    );

    await waitFor(() => expect(getByTestId(TEST_ID)));

    // Trigger claim
    fireEvent.click(getByTestId(TEST_ID));

    // Check claimXvsReward was called and success toast was displayed
    await waitFor(() => expect(claimXvsReward).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
  });
});
