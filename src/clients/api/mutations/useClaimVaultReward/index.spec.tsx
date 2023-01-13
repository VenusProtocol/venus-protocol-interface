import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import { claimVaiVaultReward, claimVrtVaultReward, claimXvsVaultReward } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import useClaimVaultReward from '.';

jest.mock('clients/api');

const fakeClaimRewardButtonLabel = 'Claim reward';

describe('api/mutation/useClaimVaultReward', () => {
  it('calls claimXvsVaultReward with correct parameters when calling stake a poolIndex', async () => {
    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { claimReward } = useClaimVaultReward();

      return (
        <>
          <button
            onClick={() =>
              claimReward({
                stakedToken: TOKENS.vai,
                rewardToken: TOKENS.xvs,
                accountAddress: fakeAccountAddress,
                poolIndex: fakePoolIndex,
              })
            }
            type="button"
          >
            {fakeClaimRewardButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on claim reward button
    fireEvent.click(getByText(fakeClaimRewardButtonLabel));

    await waitFor(() => expect(claimXvsVaultReward).toHaveBeenCalledTimes(1));
    expect(claimXvsVaultReward).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
      poolIndex: fakePoolIndex,
      rewardToken: TOKENS.xvs,
    });
  });

  it('calls claimVaiVaultReward with correct parameters when calling stake without a poolIndex and stakedToken is VAI', async () => {
    const TestComponent: React.FC = () => {
      const { claimReward } = useClaimVaultReward();

      return (
        <>
          <button
            onClick={() =>
              claimReward({
                stakedToken: TOKENS.vai,
                rewardToken: TOKENS.xvs,
                accountAddress: fakeAccountAddress,
              })
            }
            type="button"
          >
            {fakeClaimRewardButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on claim reward button
    fireEvent.click(getByText(fakeClaimRewardButtonLabel));

    await waitFor(() => expect(claimVaiVaultReward).toHaveBeenCalledTimes(1));
    expect(claimVaiVaultReward).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
    });
  });

  it('calls claimVrtVaultReward with correct parameters when calling stake without a poolIndex and stakedToken is VRT', async () => {
    const TestComponent: React.FC = () => {
      const { claimReward } = useClaimVaultReward();

      return (
        <>
          <button
            onClick={() =>
              claimReward({
                stakedToken: TOKENS.vrt,
                rewardToken: TOKENS.xvs,
                accountAddress: fakeAccountAddress,
              })
            }
            type="button"
          >
            {fakeClaimRewardButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on claim reward button
    fireEvent.click(getByText(fakeClaimRewardButtonLabel));

    await waitFor(() => expect(claimVrtVaultReward).toHaveBeenCalledTimes(1));
    expect(claimVrtVaultReward).toHaveBeenCalledWith({
      fromAccountAddress: fakeAccountAddress,
    });
  });
});
