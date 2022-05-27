import BigNumber from 'bignumber.js';
import {
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import { VBep20 } from 'types/contracts';
import redeem from './redeem';

const fakeAmount = new BigNumber(10000000000000000);

describe('api/mutation/redeem', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        redeem: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VBep20;

    try {
      await redeem({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('redeem should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    const fakeContract = {
      methods: {
        redeem: () => ({
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
      await redeem({
        tokenContract: fakeContract,
        amountWei: fakeAmount,
        account: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('redeem should have thrown an error but did not');
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
    const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
    const fakeTransactionReceipt = { events: {} };
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const redeemMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        redeem: redeemMock,
      },
    } as unknown as VBep20;

    const response = await redeem({
      tokenContract: fakeContract,
      amountWei: fakeAmount,
      account: fakeFromAccountsAddress,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(redeemMock).toHaveBeenCalledTimes(1);
    expect(redeemMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
