import BigNumber from 'bignumber.js';

import { TOKENS } from 'constants/tokens';
import { XvsVault } from 'types/contracts';

import getXvsVaultRewardWeiPerBlock from '.';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultRewardPerBlock', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        rewardTokenAmountsPerBlock: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultRewardPerBlock({
        xvsVaultContract: fakeContract,
        tokenAddress: xvsTokenAddress,
      });

      throw new Error('getXvsVaultRewardPerBlock should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the reward per block in wei on success', async () => {
    const fakeOutput = '2000000000000000000';

    const callMock = jest.fn(async () => fakeOutput);
    const rewardTokenAmountsPerBlockMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        rewardTokenAmountsPerBlock: rewardTokenAmountsPerBlockMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultRewardPerBlock({
      xvsVaultContract: fakeContract,
      tokenAddress: xvsTokenAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response).toEqual({
      rewardPerBlockWei: new BigNumber(fakeOutput),
    });
  });
});
