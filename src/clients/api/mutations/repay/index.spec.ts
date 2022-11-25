import BigNumber from 'bignumber.js';
import { VError } from 'errors';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { getMaximillionContract, getVTokenContract } from 'clients/contracts';
import {
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import MAX_UINT256 from 'constants/maxUint256';
import { VBEP_TOKENS } from 'constants/tokens';
import { VBep20, VBnbToken } from 'types/contracts';

import repay, { REPAYMENT_BNB_BUFFER_PERCENTAGE } from '.';

const fakeAmountWei = new BigNumber(10000000000000000);

jest.mock('clients/contracts');

describe('api/mutation/repay', () => {
  describe('repay non-BNB loan', () => {
    test('throws an error when request fails', async () => {
      const fakeWeb3 = {} as any;

      const fakeVTokenContract = {
        methods: {
          repayBorrow: () => ({
            send: async () => {
              throw new Error('Fake error message');
            },
          }),
        },
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      try {
        await repay({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.xvs,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('throws a transaction error when Failure event is present', async () => {
      const fakeWeb3 = {} as any;

      const fakeVTokenContract = {
        methods: {
          repayBorrow: () => ({
            send: async () => ({
              events: {
                Failure: {
                  returnValues: {
                    info: '2',
                    error: '2',
                  },
                },
              },
            }),
          }),
        },
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      try {
        await repay({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.xvs,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot(`[Error: ${TokenErrorReporterError[2]}]`);
        expect(error).toBeInstanceOf(VError);

        if (error instanceof VError) {
          expect(error.type).toBe('transaction');
          expect(error.data.error).toBe(TokenErrorReporterError[2]);
          expect(error.data.info).toBe(TokenErrorReporterFailureInfo[2]);
        }
      }
    });

    test('returns receipt when request to partially repay a loan succeeds', async () => {
      const fakeWeb3 = {} as any;

      const sendMock = jest.fn(() => fakeTransactionReceipt);
      const repayBorrowMock = jest.fn(() => ({ send: sendMock }));

      const fakeVTokenContract = {
        methods: {
          repayBorrow: repayBorrowMock,
        },
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        web3: fakeWeb3,
        vToken: VBEP_TOKENS.xvs,
        amountWei: fakeAmountWei,
        accountAddress: fakeAccountAddress,
      });

      expect(response).toBe(fakeTransactionReceipt);

      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
    });

    test('returns receipt when request to fully repay a loan succeeds', async () => {
      const fakeWeb3 = {} as any;

      const sendMock = jest.fn(() => fakeTransactionReceipt);
      const repayBorrowMock = jest.fn(() => ({ send: sendMock }));

      const fakeVTokenContract = {
        methods: {
          repayBorrow: repayBorrowMock,
        },
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        web3: fakeWeb3,
        vToken: VBEP_TOKENS.xvs,
        amountWei: fakeAmountWei,
        accountAddress: fakeAccountAddress,
        isRepayingFullLoan: true,
      });

      expect(response).toBe(fakeTransactionReceipt);

      expect(repayBorrowMock).toHaveBeenCalledTimes(1);
      expect(repayBorrowMock).toHaveBeenCalledWith(MAX_UINT256.toFixed());

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
    });
  });

  describe('repay full BNB loan', () => {
    test('throws an error when request fails', async () => {
      const fakeWeb3 = {} as any;

      const fakeMaximillionContract = {
        methods: {
          repayBehalfExplicit: () => ({
            send: async () => {
              throw new Error('Fake error message');
            },
          }),
        },
      } as unknown as VBep20;

      (getMaximillionContract as jest.Mock).mockImplementationOnce(() => fakeMaximillionContract);

      try {
        await repay({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.bnb,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
          isRepayingFullLoan: true,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('throws a transaction error when Failure event is present', async () => {
      const fakeWeb3 = {} as any;

      const fakeMaximillionContract = {
        methods: {
          repayBehalfExplicit: () => ({
            send: async () => ({
              events: {
                Failure: {
                  returnValues: {
                    info: '2',
                    error: '2',
                  },
                },
              },
            }),
          }),
        },
      } as unknown as VBep20;

      (getMaximillionContract as jest.Mock).mockImplementationOnce(() => fakeMaximillionContract);

      try {
        await repay({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.bnb,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
          isRepayingFullLoan: true,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot(`[Error: ${TokenErrorReporterError[2]}]`);
        expect(error).toBeInstanceOf(VError);

        if (error instanceof VError) {
          expect(error.type).toBe('transaction');
          expect(error.data.error).toBe(TokenErrorReporterError[2]);
          expect(error.data.info).toBe(TokenErrorReporterFailureInfo[2]);
        }
      }
    });

    test('returns receipt when request succeeds', async () => {
      const fakeWeb3 = {} as any;

      const sendMock = jest.fn(() => fakeTransactionReceipt);
      const repayBehalfExplicitMock = jest.fn(() => ({ send: sendMock }));

      const fakeMaximillionContract = {
        methods: {
          repayBehalfExplicit: repayBehalfExplicitMock,
        },
      } as unknown as VBep20;

      (getMaximillionContract as jest.Mock).mockImplementationOnce(() => fakeMaximillionContract);

      const response = await repay({
        web3: fakeWeb3,
        vToken: VBEP_TOKENS.bnb,
        amountWei: fakeAmountWei,
        accountAddress: fakeAccountAddress,
        isRepayingFullLoan: true,
      });

      expect(response).toBe(fakeTransactionReceipt);

      expect(repayBehalfExplicitMock).toHaveBeenCalledTimes(1);
      expect(repayBehalfExplicitMock).toHaveBeenCalledWith(
        fakeAccountAddress,
        VBEP_TOKENS.bnb.address,
      );

      const amountWithBuffer = fakeAmountWei.multipliedBy(1 + REPAYMENT_BNB_BUFFER_PERCENTAGE);

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        from: fakeAccountAddress,
        value: amountWithBuffer.toFixed(),
      });
    });
  });

  describe('repay partial BNB loan', () => {
    test('throws an error when request fails', async () => {
      const fakeWeb3 = {
        eth: {
          sendTransaction: async () => {
            throw new Error('Fake error message');
          },
        },
      } as any;

      const fakeVBnbContract = {
        methods: {
          repayBorrow: () => ({
            encodeABI: () => {},
          }),
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVBnbContract);

      try {
        await repay({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.bnb,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('throws a transaction error when Failure event is present', async () => {
      const fakeWeb3 = {
        eth: {
          sendTransaction: async () => ({
            events: {
              Failure: {
                returnValues: {
                  info: '2',
                  error: '2',
                },
              },
            },
          }),
        },
      } as any;

      const fakeVBnbContract = {
        methods: {
          repayBorrow: () => ({
            encodeABI: () => ({}),
          }),
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVBnbContract);

      try {
        await repay({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.bnb,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('repay should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot(`[Error: ${TokenErrorReporterError[2]}]`);
        expect(error).toBeInstanceOf(VError);

        if (error instanceof VError) {
          expect(error.type).toBe('transaction');
          expect(error.data.error).toBe(TokenErrorReporterError[2]);
          expect(error.data.info).toBe(TokenErrorReporterFailureInfo[2]);
        }
      }
    });

    test('returns receipt when request succeeds', async () => {
      const sendTransactionMock = jest.fn(() => fakeTransactionReceipt);

      const fakeWeb3 = {
        eth: {
          sendTransaction: sendTransactionMock,
        },
      } as any;

      const fakeAbi = 'fake-abi';
      const encodeABIMock = jest.fn(() => fakeAbi);
      const repayBorrowMock = jest.fn(() => ({ encodeABI: encodeABIMock }));

      const fakeVTokenContract = {
        methods: {
          repayBorrow: repayBorrowMock,
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await repay({
        web3: fakeWeb3,
        vToken: VBEP_TOKENS.bnb,
        amountWei: fakeAmountWei,
        accountAddress: fakeAccountAddress,
      });

      expect(response).toBe(fakeTransactionReceipt);

      expect(repayBorrowMock).toHaveBeenCalledTimes(1);

      expect(encodeABIMock).toHaveBeenCalledTimes(1);

      expect(sendTransactionMock).toHaveBeenCalledTimes(1);
      expect(sendTransactionMock).toHaveBeenCalledWith({
        from: fakeAccountAddress,
        to: VBEP_TOKENS.bnb.address,
        value: fakeAmountWei.toFixed(),
        data: fakeAbi,
      });
    });
  });
});
