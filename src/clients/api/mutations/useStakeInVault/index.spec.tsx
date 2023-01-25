import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import { stakeInVaiVault, stakeInVrtVault, stakeInXvsVault } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';

import useStakeInVault from '.';

jest.mock('clients/api');

const fakeAmountWei = new BigNumber('10000000000000000');
const fakeStakeButtonLabel = 'Stake';

describe('api/mutation/useStakeInVault', () => {
  it('calls stakeInXvsVault with correct parameters when calling stake a poolIndex', async () => {
    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedToken: TOKENS.vai,
        rewardToken: TOKENS.xvs,
        poolIndex: fakePoolIndex,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountWei: fakeAmountWei,
              })
            }
            type="button"
          >
            {fakeStakeButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on stake button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(stakeInXvsVault).toHaveBeenCalledTimes(1));
    expect(stakeInXvsVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
      poolIndex: fakePoolIndex,
      rewardToken: TOKENS.xvs,
    });
  });

  it('calls stakeInVaiVault with correct parameters when calling stake without a poolIndex and stakedToken is equal VAI', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedToken: TOKENS.vai,
        rewardToken: TOKENS.xvs,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountWei: fakeAmountWei,
              })
            }
            type="button"
          >
            {fakeStakeButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on stake button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(stakeInVaiVault).toHaveBeenCalledTimes(1));
    expect(stakeInVaiVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
    });
  });

  it('calls stakeInVrtVault with correct parameters when calling stake without a poolIndex and stakedToken is VRT', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedToken: TOKENS.vrt,
        rewardToken: TOKENS.xvs,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountWei: fakeAmountWei,
              })
            }
            type="button"
          >
            {fakeStakeButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on stake button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(stakeInVrtVault).toHaveBeenCalledTimes(1));
    expect(stakeInVrtVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
    });
  });
});
