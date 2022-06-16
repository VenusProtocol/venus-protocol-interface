import BigNumber from 'bignumber.js';
import {
  VaiControllerErrorReporterError,
  VaiControllerErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';
import { VError } from 'errors';
import repayVai from './repayVai';

describe('api/mutation/repayVai', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        repayVAI: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as any;

    try {
      await repayVai({
        vaiControllerContract: fakeContract,
        amountWei: '10000000000000000',
        fromAccountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    const fakeContract = {
      methods: {
        repayVAI: () => ({
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
    } as any;

    try {
      await repayVai({
        vaiControllerContract: fakeContract,
        amountWei: '10000000000000000',
        fromAccountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      });

      throw new Error('repayVai should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: ${VaiControllerErrorReporterError[2]}]`);
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('transaction');
        expect(error.data.error).toBe(VaiControllerErrorReporterError[2]);
        expect(error.data.info).toBe(VaiControllerErrorReporterFailureInfo[2]);
      }
    }
  });

  test('returns Receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');
    const fakeFromAccountsAddress = '0x3d759121234cd36F8124C21aFe1c6852d2bEd848';
    const fakeTransactionReceipt = { events: {} };
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const repayVAIMock = jest.fn(() => ({
      send: sendMock,
    }));
    const fakeContract = {
      methods: {
        repayVAI: repayVAIMock,
      },
    } as unknown as any;

    const response = await repayVai({
      vaiControllerContract: fakeContract,
      amountWei: fakeAmountWei.toFixed(),
      fromAccountAddress: fakeFromAccountsAddress,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(repayVAIMock).toHaveBeenCalledTimes(1);
    expect(repayVAIMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeFromAccountsAddress });
  });
});
