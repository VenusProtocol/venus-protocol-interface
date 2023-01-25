import BigNumber from 'bignumber.js';

import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import { VrtVault } from 'types/contracts';

import getVrtVaultInterestRatePerBlock from '.';

describe('api/queries/getVrtVaultInterestRatePerBlock', () => {
  test('returns the conversion ratio on success', async () => {
    const interestRatePerBlockMock = jest.fn(async () => vrtVaultResponses.interestRatePerBlock);

    const fakeContract = {
      interestRatePerBlock: interestRatePerBlockMock,
    } as unknown as VrtVault;

    const response = await getVrtVaultInterestRatePerBlock({
      vrtVaultContract: fakeContract,
    });

    expect(interestRatePerBlockMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      interestRatePerBlockWei: new BigNumber(vrtVaultResponses.interestRatePerBlock.toString()),
    });
  });
});
