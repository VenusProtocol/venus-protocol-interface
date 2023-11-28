import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { vai, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { stakeInVaiVault, stakeInXvsVault } from 'clients/api';

import useStakeInVault from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');
const fakeStakeButtonLabel = 'Stake';

describe('api/mutation/useStakeInVault', () => {
  it('calls stakeInXvsVault with correct parameters when calling stake a poolIndex', async () => {
    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedToken: vai,
        rewardToken: xvs,
        poolIndex: fakePoolIndex,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountMantissa: fakeAmountMantissa,
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
      amountMantissa: fakeAmountMantissa,
      poolIndex: fakePoolIndex,
      rewardToken: xvs,
    });
  });

  it('calls stakeInVaiVault with correct parameters when calling stake without a poolIndex and stakedToken is equal VAI', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedToken: vai,
        rewardToken: xvs,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountMantissa: fakeAmountMantissa,
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
      amountMantissa: fakeAmountMantissa,
    });
  });
});
