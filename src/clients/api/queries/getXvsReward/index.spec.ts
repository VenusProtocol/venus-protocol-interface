import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { getContractAddress } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import { VenusLens } from 'types/contracts';

import getXvsReward from '.';

describe('api/queries/getXvsReward', () => {
  test('returns correct XVS reward amount in wei', async () => {
    const fakeOutput = BN.from('73680428998277363810000000000');

    const pendingVenusMock = jest.fn(async () => fakeOutput);
    const lensContract = {
      pendingVenus: pendingVenusMock,
    };

    const res = await getXvsReward({
      lensContract: lensContract as unknown as VenusLens,
      accountAddress: fakeAddress,
    });

    expect(pendingVenusMock).toHaveBeenCalledTimes(1);
    expect(pendingVenusMock).toHaveBeenCalledWith(fakeAddress, getContractAddress('comptroller'));
    expect(res).toEqual({
      xvsRewardWei: new BigNumber(fakeOutput.toString()),
    });
  });
});
