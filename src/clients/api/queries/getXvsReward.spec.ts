import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { VenusLens } from 'types/contracts';
import getXvsReward from './getXvsReward';

describe('api/queries/getXvsReward', () => {
  test('throws an error when one of VenusLens contract call fails', async () => {
    const lensContract = {
      methods: {
        pendingVenus() {
          return {
            call() {
              throw new Error('Fake error message');
            },
          };
        },
      },
    };

    try {
      await getXvsReward({
        lensContract: lensContract as unknown as VenusLens,
        accountAddress: fakeAddress,
      });

      throw new Error('getXvsReward should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns correct XVS reward amount in wei', async () => {
    const fakeOutput = '73680428998277363810000000000';

    const lensContract = {
      methods: {
        pendingVenus() {
          return {
            call() {
              return fakeOutput;
            },
          };
        },
      },
    };

    const res = await getXvsReward({
      lensContract: lensContract as unknown as VenusLens,
      accountAddress: fakeAddress,
    });

    expect(res instanceof BigNumber).toBe(true);
    expect(res).toStrictEqual(new BigNumber(fakeOutput));
  });
});
