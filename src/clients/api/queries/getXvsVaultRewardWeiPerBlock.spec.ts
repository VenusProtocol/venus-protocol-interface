import { XvsVault } from 'types/contracts';
import { TOKENS } from 'constants/tokens';
import { VError } from 'errors';
import getXvsVaultRewardTokenAmountsPerBlock from './getXvsVaultRewardWeiPerBlock';

const xvsTokenAddress = TOKENS.xvs.address;

describe('api/queries/getXvsVaultRewardTokenAmountsPerBlock', () => {
  test('throws an error when providing an invalid token address', async () => {
    const fakeContract = {
      methods: {
        rewardTokenAmountsPerBlock: () => ({
          call: jest.fn(),
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultRewardTokenAmountsPerBlock({
        xvsVaultContract: fakeContract,
        tokenAddress: 'invalid token address',
      });

      throw new Error(
        'getXvsVaultRewardTokenAmountsPerBlock should have thrown an error but did not',
      );
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      expect(error).toMatchInlineSnapshot('[Error: invalidTokenAddressProvided]');
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.code).toBe('invalidTokenAddressProvided');
      }
    }
  });

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
      await getXvsVaultRewardTokenAmountsPerBlock({
        xvsVaultContract: fakeContract,
        tokenAddress: xvsTokenAddress,
      });

      throw new Error(
        'getXvsVaultRewardTokenAmountsPerBlock should have thrown an error but did not',
      );
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the reward per block in wei on success', async () => {
    const fakeOutput = '36';

    const callMock = jest.fn(async () => fakeOutput);
    const rewardTokenAmountsPerBlockMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        rewardTokenAmountsPerBlock: rewardTokenAmountsPerBlockMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultRewardTokenAmountsPerBlock({
      xvsVaultContract: fakeContract,
      tokenAddress: xvsTokenAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledTimes(1);
    expect(rewardTokenAmountsPerBlockMock).toHaveBeenCalledWith(xvsTokenAddress);
    expect(response.toFixed()).toStrictEqual('2000000000000000000');
  });
});
