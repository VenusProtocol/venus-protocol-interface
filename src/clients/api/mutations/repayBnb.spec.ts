import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { getVBepToken } from 'utilities';
import transactionReceipt from '__mocks__/models/transactionReceipt';
import { getVTokenContract } from 'clients/contracts';
import repayBnb from './repayBnb';

jest.mock('clients/contracts');

const fakeEncodedAbi = 'fake encoded ABI';

describe('api/mutation/repayBnb', () => {
  beforeEach(() => {
    (getVTokenContract as jest.Mock).mockImplementationOnce(() => ({
      methods: {
        repayBorrow: () => ({
          send: async () => {},
          encodeABI: () => fakeEncodedAbi,
        }),
      },
    }));
  });

  test('throws an error when request fails', async () => {
    const fakeWeb3 = {
      eth: {
        sendTransaction: async () => {
          throw new Error('Fake error message');
        },
      },
    } as unknown as Web3;

    try {
      await repayBnb({
        web3: fakeWeb3,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: fakeAddress,
      });

      throw new Error('repayBnb should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');

    const fakeWeb3 = {
      eth: {
        sendTransaction: jest.fn(async () => transactionReceipt),
      },
    } as unknown as Web3;

    const response = await repayBnb({
      web3: fakeWeb3,
      amountWei: fakeAmountWei,
      fromAccountAddress: fakeAddress,
    });

    expect(response).toBe(transactionReceipt);
    expect(fakeWeb3.eth.sendTransaction).toHaveBeenCalledTimes(1);
    expect(fakeWeb3.eth.sendTransaction).toHaveBeenCalledWith({
      from: fakeAddress,
      to: getVBepToken('bnb').address,
      value: fakeAmountWei.toFixed(),
      data: fakeEncodedAbi,
    });
  });
});
