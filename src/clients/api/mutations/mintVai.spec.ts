import { Contract } from 'web3-eth-contract';
import BigNumber from 'bignumber.js';

import mintVai from './mintVai';

describe('api/mutation/mintVai', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        mintVAI: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Contract;

    try {
      await mintVai({
        vaiControllerContract: fakeContract,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('mintVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    const fakeContract = {
      methods: {
        mintVAI: () => ({
          send: async () => undefined,
        }),
      },
    } as unknown as Contract;

    const response = await await mintVai({
      vaiControllerContract: fakeContract,
      amountWei: new BigNumber('10000000000000000'),
      fromAccountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
    });

    expect(response).toBe(undefined);
  });
});
