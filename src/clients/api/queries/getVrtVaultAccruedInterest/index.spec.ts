import BigNumber from 'bignumber.js';

import vrtVaultResponses from '__mocks__/contracts/vrtVault';
import fakeAccountAddress from '__mocks__/models/address';
import { VrtVault } from 'types/contracts';

import getVrtVaultAccruedInterest from '.';

describe('api/queries/getVrtVaultAccruedInterest', () => {
  test('returns the pending reward of the user in wei on success', async () => {
    const getAccruedInterestMock = jest.fn(async () => vrtVaultResponses.getAccruedInterest);

    const fakeContract = {
      getAccruedInterest: getAccruedInterestMock,
    } as unknown as VrtVault;

    const response = await getVrtVaultAccruedInterest({
      vrtVaultContract: fakeContract,
      accountAddress: fakeAccountAddress,
    });

    expect(getAccruedInterestMock).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
      accruedInterestWei: new BigNumber(vrtVaultResponses.getAccruedInterest.toString()),
    });
  });
});
