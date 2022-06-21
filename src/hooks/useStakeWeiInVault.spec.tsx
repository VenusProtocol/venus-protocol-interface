import React from 'react';
import BigNumber from 'bignumber.js';
import { waitFor, fireEvent } from '@testing-library/react';

import { TokenId } from 'types';
import { TOKENS } from 'constants/tokens';
import { stakeWeiInXvsVault, stakeWeiInVaiVault, stakeWeiInVrtVault } from 'clients/api';
import fakeAccountAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import useStakeWeiInVault from './useStakeWeiInVault';

jest.mock('clients/api');

const fakeAmountWei = new BigNumber('10000000000000000');
const fakeStakeButtonLabel = 'Stake';

describe('hooks/useStakeWeiInVault', () => {
  it('calls stakeWeiInXvsVault with correct parameters when calling stake a poolIndex', async () => {
    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { stake } = useStakeWeiInVault({
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

    // Click on XVS vault button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(stakeWeiInXvsVault).toHaveBeenCalledTimes(1));
    expect(stakeWeiInXvsVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeAccountAddress,
      poolIndex: fakePoolIndex,
      rewardTokenAddress: TOKENS.xvs.address,
    });
  });

  it('calls stakeWeiInVaiVault with correct parameters when calling stake without a poolIndex and stakedTokenId is equal to "vai"', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeWeiInVault({
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

    // Click on VAI vault button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(stakeWeiInVaiVault).toHaveBeenCalledTimes(1));
    expect(stakeWeiInVaiVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeAccountAddress,
    });
  });

  it('calls stakeWeiInVrtVault with correct parameters when calling stake without a poolIndex and stakedTokenId is equal to "vrt"', async () => {
    const TestComponent: React.FC = () => {
      const { stake } = useStakeWeiInVault({
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

    // Click on VAI vault button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(stakeWeiInVrtVault).toHaveBeenCalledTimes(1));
    expect(stakeWeiInVrtVault).toHaveBeenCalledWith({
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeAccountAddress,
    });
  });
});
