import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';
import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import getVrtVaultInterestRatePerBlock from './getVrtVaultInterestRatePerBlock';

describe('api/queries/getVrtVaultInterestRatePerBlock', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        interestRatePerBlock: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtVault;

    try {
      await getVrtVaultInterestRatePerBlock({
        vrtVaultContract: fakeContract,
      });

      throw new Error('getVrtVaultInterestRatePerBlock should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the conversion ratio on success', async () => {
    const callMock = jest.fn(async () => vrtVaultResponses.interestRatePerBlock);
    const interestRatePerBlockMock = jest.fn(() => ({
      call: callMock,
    }));

    const fakeContract = {
      methods: {
        interestRatePerBlock: interestRatePerBlockMock,
      },
    } as unknown as VrtVault;

    const response = await getVrtVaultInterestRatePerBlock({
      vrtVaultContract: fakeContract,
    });

    expect(interestRatePerBlockMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledTimes(1);
    expect(callMock).toHaveBeenCalledWith();
    expect(response instanceof BigNumber).toBe(true);
    expect(response.toFixed()).toEqual(vrtVaultResponses.interestRatePerBlock);
  });
});
