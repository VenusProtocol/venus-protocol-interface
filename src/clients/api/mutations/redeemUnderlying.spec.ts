import BigNumber from 'bignumber.js';
import {
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import fakeAccountAddress from '__mocks__/models/address';
import { VBep20 } from 'types/contracts';
import redeemUnderlying from './redeemUnderlying';

const fakeAmount = new BigNumber(10000000000000000);

describe('api/mutation/redeemUnderlying', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        redeemUnderlying: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await redeemUnderlying({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: fakeAccountAddress,
      });

      throw new Error('redeemUnderlying should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    const fakeContract = {
      methods: {
        redeemUnderlying: () => ({
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

    try {
      await redeemUnderlying({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: fakeAccountAddress,
      });

      throw new Error('redeemUnderlying should have thrown an error but did not');
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

  test('returns Receipt when request succeeds', async () => {
    const fakeTransactionReceipt = { events: {} };
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const redeemUnderlyingMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        redeemUnderlying: redeemUnderlyingMock,
      },
    } as unknown as VBep20;

    const response = await redeemUnderlying({
      tokenContract: fakeContract,
      amountWei: fakeAmount,
      account: fakeAccountAddress,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(redeemUnderlyingMock).toHaveBeenCalledTimes(1);
    expect(redeemUnderlyingMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
  });
});
