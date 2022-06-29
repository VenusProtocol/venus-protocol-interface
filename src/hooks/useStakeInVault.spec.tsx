import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { TokenId } from 'types';
import { TOKENS } from 'constants/tokens';
import { stakeInXvsVault, stakeInVaiVault, stakeInVrtVault } from 'clients/api';
import fakeAccountAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import useStakeInVault from './useStakeInVault';

jest.mock('clients/api');

const fakeAmountWei = new BigNumber('10000000000000000');
const fakeStakeButtonLabel = 'Stake';

describe('hooks/useStakeInVault', () => {
  it('calls stakeInXvsVault with correct parameters when calling stake a poolIndex', async () => {
    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedTokenId: TOKENS.vai.id as TokenId,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                rewardTokenId: TOKENS.xvs.id as TokenId,
                amountWei: fakeAmountWei,
                accountAddress: fakeAccountAddress,
                poolIndex: fakePoolIndex,
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
      fromAccountAddress: fakeAccountAddress,
      poolIndex: fakePoolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
    });
  });

  it('calls stakeInVaiVault with correct parameters when calling stake without a poolIndex and stakedTokenId is equal to "vai"', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedTokenId: TOKENS.vai.id as TokenId,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                rewardTokenId: TOKENS.xvs.id as TokenId,
                amountWei: fakeAmountWei,
                accountAddress: fakeAccountAddress,
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
      fromAccountAddress: fakeAccountAddress,
    });
  });

  it('calls stakeInVrtVault with correct parameters when calling stake without a poolIndex and stakedTokenId is equal to "vrt"', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault({
        stakedTokenId: TOKENS.vrt.id as TokenId,
      });

      return (
        <>
          <button
            onClick={() =>
              stake({
                rewardTokenId: TOKENS.xvs.id as TokenId,
                amountWei: fakeAmountWei,
                accountAddress: fakeAccountAddress,
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
      fromAccountAddress: fakeAccountAddress,
    });
  });
});
