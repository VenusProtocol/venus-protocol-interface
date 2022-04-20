import BigNumber from 'bignumber.js';
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
        borrowIndex: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
        borrowBalanceStored: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
        balanceOf: () => ({
          call: async () => {
            throw new Error('Fake error message');
          },
        }),
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

  test('returns token data in correct format on success', async () => {
    const fakeBorrowIndex = '0';
    const fakeBorrowBalanceStored = '100000000000';
    const fakeBalanceOf = '200000000000';
    const fakeVenusSupplyState = {
      index: '1',
      block: '1',
    };
    const fakeVenusBorrowState = {
      index: '2',
      block: '2',
    };
    const fakeVenusBorrowerIndex = '3';
    const fakeVenusSupplierIndex = '4';

    (getVTokenContract as jest.Mock).mockImplementationOnce(() => ({
      methods: {
        borrowIndex: () => ({ call: async () => fakeBorrowIndex }),
        borrowBalanceStored: () => ({ call: async () => fakeBorrowBalanceStored }),
        balanceOf: () => ({ call: async () => fakeBalanceOf }),
      },
    }));

    const fakeComptrollerContract = {
      methods: {
        venusSupplyState: () => ({
          call: async () => fakeVenusSupplyState,
        }),
        venusBorrowState: () => ({
          call: async () => fakeVenusBorrowState,
        }),
        venusBorrowerIndex: () => ({
          call: async () => fakeVenusBorrowerIndex,
        }),
        venusSupplierIndex: () => ({
          call: async () => fakeVenusSupplierIndex,
        }),
      },
    } as unknown as Comptroller;

    const res = await getVTokenData({
      comptrollerContract: fakeComptrollerContract,
      web3: {} as unknown as Web3,
      accountAddress: fakeAddress,
      tokenId: 'xvs',
      tokenAddress: fakeAddress,
    });

    expect(res).toStrictEqual({
      supplyStateIndex: fakeVenusSupplyState.index,
      borrowStateIndex: fakeVenusBorrowState.index,
      userBorrowIndex: fakeVenusBorrowerIndex,
      userSupplyIndex: fakeVenusSupplierIndex,
      tokenBorrowIndex: fakeBorrowIndex,
      userBorrowBalanceStoredWei: expect.any(BigNumber),
      userBalanceWei: expect.any(BigNumber),
    });
    expect(res.userBorrowBalanceStoredWei.toFixed()).toBe(fakeBorrowBalanceStored);
    expect(res.userBalanceWei.toFixed()).toBe(fakeBalanceOf);
  });
});
