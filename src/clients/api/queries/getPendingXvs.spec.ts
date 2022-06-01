import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { VaiVault } from 'types/contracts';
import getPendingXvs from './getPendingXvs';

describe('api/queries/getPendingXVS', () => {
  test('throws an error when one of VaiVault contract call fails', async () => {
    const vaiVaultContract = {
      methods: {
        pendingXVS() {
          return {
            call() {
              throw new Error('Fake error message');
            },
          };
        },
      },
    };

    try {
      await getPendingXvs({
        vaiVaultContract: vaiVaultContract as unknown as VaiVault,
        accountAddress: fakeAddress,
      });

      throw new Error('getPendingXVS should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns correct locked XVS amount in wei', async () => {
    const vaiVaultContract = {
      methods: {
        pendingXVS() {
          return {
            call() {
              return '73680428998277363810000000000';
            },
          };
        },
      },
    };

    const res = await getPendingXvs({
      vaiVaultContract: vaiVaultContract as unknown as VaiVault,
      accountAddress: fakeAddress,
    });

    expect(res instanceof BigNumber).toBe(true);
    expect(res.toFixed()).toBe('73680428998277363810000000000');
  });
});
