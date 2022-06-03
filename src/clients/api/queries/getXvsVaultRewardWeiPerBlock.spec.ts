import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { TOKENS } from 'constants/tokens';
import getXvsVaultRewardWeiPerBlock from './getXvsVaultRewardWeiPerBlock';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultRewardWeiPerBlock', () => {
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
      await getXvsVaultRewardWeiPerBlock({
        xvsVaultContract: fakeContract,
        tokenAddress: xvsTokenAddress,
      });

      throw new Error('getXvsVaultRewardWeiPerBlock should have thrown an error but did not');
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

    const response = await getXvsVaultRewardWeiPerBlock({
      xvsVaultContract: fakeContract,
      tokenAddress: xvsTokenAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response).toStrictEqual(new BigNumber(fakeOutput));
  });
});
