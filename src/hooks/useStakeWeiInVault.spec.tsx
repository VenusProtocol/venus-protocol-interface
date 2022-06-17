import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { stakeWeiInXvsVault } from 'clients/api';
import fakeAccountAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import useStakeWeiInVault from './useStakeWeiInVault';

jest.mock('clients/api');

const fakeStakedTokenId = 'vai';
const fakeRewardTokenId = 'xvs';
const fakeAmountWei = new BigNumber('10000000000000000');
const fakePoolIndex = 6;

const xvsVaultButtonLabel = 'Stake in XVS vault';

const TestComponent: React.FC = () => {
  const { stake } = useStakeWeiInVault({
    stakedTokenId: fakeStakedTokenId,
  });

  return (
    <>
      <button
        onClick={() =>
          stake({
            rewardTokenId: fakeRewardTokenId,
            amountWei: fakeAmountWei,
            accountAddress: fakeAccountAddress,
            poolIndex: fakePoolIndex,
          })
        }
        type="button"
      >
        {xvsVaultButtonLabel}
      </button>
    </>
  );
};

describe('hooks/useStakeWeiInVault', () => {
  it('calls stakeWeiInXvsVault with correct parameters when calling stake with a poolIndex', async () => {
    const { getByText } = renderComponent(<TestComponent />);

    // Click on XVS vault button
    fireEvent.click(getByText(xvsVaultButtonLabel));

    await waitFor(() => expect(stakeWeiInXvsVault).toHaveBeenCalledTimes(1));
    expect(stakeWeiInXvsVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeAccountAddress,
      poolIndex: fakePoolIndex,
      rewardTokenAddress: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff', // XVS token address
    });
  });
});
