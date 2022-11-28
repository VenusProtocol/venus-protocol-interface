import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import fakeAddress from '__mocks__/models/address';
import transactionReceipt from '__mocks__/models/transactionReceipt';
import { getMaximillionContract, getVTokenContract } from 'clients/contracts';
import { VBEP_TOKENS } from 'constants/tokens';

import repayBnb, { REPAYMENT_BNB_BUFFER_PERCENTAGE } from '.';

jest.mock('clients/contracts');

const fakeEncodedAbi = 'fake encoded ABI';
const fakeAmountWei = new BigNumber('10000000000000000');

describe('api/mutation/repayBnb', () => {
  describe('repay partial BNB loan', () => {
    beforeEach(() => {
      (getVTokenContract as jest.Mock).mockImplementationOnce(() => ({
        methods: {
          repayBorrow: () => ({
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
          amountWei: fakeAmountWei,
          fromAccountAddress: fakeAddress,
        });

        throw new Error('repayBnb should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('returns transaction receipt when request succeeds', async () => {
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
        to: VBEP_TOKENS.bnb.address,
        value: fakeAmountWei.toFixed(),
        data: fakeEncodedAbi,
      });
    });
  });

  describe('repay full BNB loan', () => {
    test('throws an error when request fails', async () => {
      (getMaximillionContract as jest.Mock).mockImplementationOnce(() => ({
        methods: {
          repayBehalfExplicit: () => ({
            send: () => {
              throw new Error('Fake error message');
            },
          }),
        },
      }));

      const fakeWeb3 = {} as unknown as Web3;

      try {
        await repayBnb({
          web3: fakeWeb3,
          amountWei: fakeAmountWei,
          fromAccountAddress: fakeAddress,
          isRepayingFullLoan: true,
        });

        throw new Error('repayBnb should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('returns transaction receipt when request succeeds', async () => {
      const sendMock = jest.fn(async () => transactionReceipt);
      const repayBehalfExplicit = jest.fn(() => ({
        send: sendMock,
      }));

      (getMaximillionContract as jest.Mock).mockImplementationOnce(() => ({
        methods: {
          repayBehalfExplicit,
        },
      }));

      const fakeWeb3 = {} as unknown as Web3;

      const response = await repayBnb({
        web3: fakeWeb3,
        amountWei: fakeAmountWei,
        fromAccountAddress: fakeAddress,
        isRepayingFullLoan: true,
      });

      expect(response).toBe(transactionReceipt);
      expect(repayBehalfExplicit).toHaveBeenCalledTimes(1);
      expect(repayBehalfExplicit).toHaveBeenCalledWith(fakeAddress, VBEP_TOKENS.bnb.address);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        from: fakeAddress,
        value: fakeAmountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE).toFixed(0),
      });
    });
  });
});
