import BigNumber from 'bignumber.js';
import { VError } from 'errors';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { getVTokenContract } from 'clients/contracts';
import {
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VBEP_TOKENS } from 'constants/tokens';
import { VBep20, VBnbToken } from 'types/contracts';

import supply from '.';

const fakeAmountWei = new BigNumber(10000000000000000);

jest.mock('clients/contracts');

describe('api/mutation/supply', () => {
  describe('supply non-BNB token', () => {
    test('throws an error when request fails', async () => {
      const fakeWeb3 = {} as any;

      const fakeVTokenContract = {
        methods: {
          mint: () => ({
            send: async () => {
              throw new Error('Fake error message');
            },
          }),
        },
      } as unknown as VBep20;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      try {
        await supply({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.xvs,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('supply should have thrown an error but did not');
      } catch (error) {
        expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
      }
    });

    test('throws a transaction error when Failure event is present', async () => {
      const fakeWeb3 = {} as any;

      const fakeVTokenContract = {
        methods: {
          mint: () => ({
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
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      try {
        await supply({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.xvs,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('supply should have thrown an error but did not');
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
      const mintMock = jest.fn(() => ({ send: sendMock }));

      const fakeVTokenContract = {
        methods: {
          mint: mintMock,
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        web3: fakeWeb3,
        vToken: VBEP_TOKENS.xvs,
        amountWei: fakeAmountWei,
        accountAddress: fakeAccountAddress,
      });

      expect(response).toBe(fakeTransactionReceipt);

      expect(mintMock).toHaveBeenCalledTimes(1);
      expect(mintMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
    });
  });

  describe('supply BNB', () => {
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
          mint: () => ({
            encodeABI: () => ({}),
          }),
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVBnbContract);

      try {
        await supply({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.bnb,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('supply should have thrown an error but did not');
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
          mint: () => ({
            encodeABI: () => ({}),
          }),
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVBnbContract);

      try {
        await supply({
          web3: fakeWeb3,
          vToken: VBEP_TOKENS.bnb,
          amountWei: fakeAmountWei,
          accountAddress: fakeAccountAddress,
        });

        throw new Error('supply should have thrown an error but did not');
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
      const mintMock = jest.fn(() => ({ encodeABI: encodeABIMock }));

      const fakeVTokenContract = {
        methods: {
          mint: mintMock,
        },
      } as unknown as VBnbToken;

      (getVTokenContract as jest.Mock).mockImplementationOnce(() => fakeVTokenContract);

      const response = await supply({
        web3: fakeWeb3,
        vToken: VBEP_TOKENS.bnb,
        amountWei: fakeAmountWei,
        accountAddress: fakeAccountAddress,
      });

      expect(response).toBe(fakeTransactionReceipt);

      expect(mintMock).toHaveBeenCalledTimes(1);

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
