import { Contract } from 'web3-eth-contract';
import BigNumber from 'bignumber.js';

import getVaiTreasuryPercentage from './getVaiTreasuryPercentage';

describe('api/queries/getVaiTreasuryPercentage', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        treasuryPercent: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Contract;

    try {
      await getVaiTreasuryPercentage({ vaiControllerContract: fakeContract });

      throw new Error('getVaiTreasuryPercentage should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns the VAI treasury percentage in the correct format', async () => {
    const fakeContract = {
      methods: {
        treasuryPercent: () => ({
          call: async () => new BigNumber('1000000000000000'),
        }),
      },
    } as unknown as Contract;

    const response = await getVaiTreasuryPercentage({ vaiControllerContract: fakeContract });

    expect(response).toBe(0.1);
  });
});
