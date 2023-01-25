import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { claimXvsReward, getXvsReward } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';

import ClaimXvsRewardButton from '.';
import TEST_IDS from '../testIds';

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('pages/Dashboard/ClaimXvsRewardButton', () => {
  it('renders without crashing', () => {
    renderComponent(<ClaimXvsRewardButton />);
  });

  it('renders nothing if user have not connected any wallet', () => {
    const { queryAllByTestId } = renderComponent(<ClaimXvsRewardButton />);
    expect(queryAllByTestId(TEST_IDS.claimXvsRewardButton)).toHaveLength(0);
  });

  it('renders nothing if user have no claimable XVS reward', () => {
    const { queryAllByTestId } = renderComponent(() => <ClaimXvsRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });
    expect(queryAllByTestId(TEST_IDS.claimXvsRewardButton)).toHaveLength(0);
  });

  it('renders correct XVS reward when user are connected and have claimable XVS reward', async () => {
    (getXvsReward as jest.Mock).mockImplementationOnce(async () => ({
      xvsRewardWei: new BigNumber('10000000000000000'),
    }));

    const { getByTestId } = renderComponent(() => <ClaimXvsRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimXvsRewardButton)));
    expect(getByTestId(TEST_IDS.claimXvsRewardButton).textContent).toContain('0.01 XVS');
  });

  it('it claims XVS reward on click and displays successful transaction modal on success', async () => {
    const fakeXvsReward = new BigNumber('10000000000000000');

    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
    (getXvsReward as jest.Mock).mockImplementationOnce(async () => ({
      xvsRewardWei: fakeXvsReward,
    }));
    (claimXvsReward as jest.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByTestId } = renderComponent(() => <ClaimXvsRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimXvsRewardButton)));

    // Trigger claim
    fireEvent.click(getByTestId(TEST_IDS.claimXvsRewardButton));

    // Check claimXvsReward was called and success toast was displayed
    await waitFor(() => expect(claimXvsReward).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: TOKENS.xvs,
        valueWei: fakeXvsReward,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
