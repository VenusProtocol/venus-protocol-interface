import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';
import fakeAccountAddress from '__mocks__/models/address';
import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import getVrtVaultAccruedInterestWei from './getVrtVaultAccruedInterestWei';

describe('api/queries/getVrtVaultAccruedInterestWei', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        getAccruedInterest: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtVault;

    try {
      await getVrtVaultAccruedInterestWei({
        vrtVaultContract: fakeContract,
        accountAddress: fakeAccountAddress,
      });

      throw new Error('getXvsVaultTotalAllocationPoints should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the pending reward of the user in wei on success', async () => {
    const callMock = jest.fn(async () => vrtVaultResponses.getAccruedInterest);
    const getAccruedInterestMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        getAccruedInterest: getAccruedInterestMock,
      },
    } as unknown as VrtVault;

    const response = await getVrtVaultAccruedInterestWei({
      vrtVaultContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(callMock).toHaveBeenCalledTimes(1);
    expect(getAccruedInterestMock).toHaveBeenCalledTimes(1);
    expect(response instanceof BigNumber).toBe(true);
    expect(response.toFixed()).toStrictEqual(vrtVaultResponses.getAccruedInterest);
  });
});
