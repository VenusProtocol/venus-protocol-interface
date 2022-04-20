import Web3 from 'web3';

import fakeAddress from '__mocks__/models/address';
import { Comptroller } from 'types/contracts';
import { getVTokenContract } from 'clients/contracts';
import getVTokenData from './getVTokenData';

jest.mock('clients/contracts');

describe('api/queries/getXvsReward/getVTokenData', () => {
  test('throws an error when one of the requests fails', async () => {
    (getVTokenContract as jest.Mock).mockImplementationOnce(() => ({
      methods: {
        borrowIndex: () => ({ call: async () => jest.fn() }),
        borrowBalanceStored: () => ({ call: async () => jest.fn() }),
        balanceOf: () => ({ call: async () => jest.fn() }),
      },
    }));

    const fakeComptrollerContract = {
      methods: {
        venusSupplyState: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
        venusBorrowState: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
        venusBorrowerIndex: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
        venusSupplierIndex: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as Comptroller;

    try {
      await getVTokenData({
        comptrollerContract: fakeComptrollerContract,
        web3: {} as unknown as Web3,
        accountAddress: fakeAddress,
        tokenId: 'xvs',
        tokenAddress: fakeAddress,
      });

      throw new Error('getVTokenContract should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });
});
