import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { TOKENS } from 'constants/tokens';
import { VError } from 'errors';
import fakeAccountAddress from '__mocks__/models/address';
import getXvsVaultPendingRewardWei from './getXvsVaultPendingRewardWei';

const xvsTokenAddress = TOKENS.xvs.address;
const fakePid = 1;

describe('api/queries/getXvsVaultPendingRewardWei', () => {
  test('throws an error when providing an invalid token address', async () => {
    const fakeContract = {
      methods: {
        pendingReward: () => ({
          call: jest.fn(),
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultPendingRewardWei({
        xvsVaultContract: fakeContract,
        tokenAddress: 'invalid token address',
        accountAddress: fakeAccountAddress,
        poolIndex: fakePid,
      });

      throw new Error('getXvsVaultPendingRewardWei should have thrown an error but did not');
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
        pendingReward: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVault;

    try {
      await getXvsVaultPendingRewardWei({
        xvsVaultContract: fakeContract,
        tokenAddress: xvsTokenAddress,
        accountAddress: fakeAccountAddress,
        poolIndex: fakePid,
      });

      throw new Error('getXvsVaultTotalAllocationPoints should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the pending reward of the user in wei on success', async () => {
    const fakeOutput = '36';

    const callMock = jest.fn(async () => fakeOutput);
    const pendingRewardMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        pendingReward: pendingRewardMock,
      },
    } as unknown as XvsVault;

    const response = await getXvsVaultPendingRewardWei({
      xvsVaultContract: fakeContract,
      tokenAddress: xvsTokenAddress,
      accountAddress: fakeAccountAddress,
      poolIndex: fakePid,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(pendingRewardMock).toHaveBeenCalledTimes(1);
    expect(pendingRewardMock).toHaveBeenCalledWith(xvsTokenAddress, fakePid, fakeAccountAddress);
    expect(response).toStrictEqual(new BigNumber('2000000000000000000'));
  });
});
