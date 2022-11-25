import BigNumber from 'bignumber.js';
import { VError } from 'errors';

import address from '__mocks__/models/address';
import { VTokenContract } from 'clients/contracts/types';
import {
  TokenErrorReporterError,
  TokenErrorReporterFailureInfo,
} from 'constants/contracts/errorReporter';

import borrow from '.';

describe('api/mutation/borrow', () => {
  test('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        borrow: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VTokenContract<'xvs'>;

    try {
      await borrow({
        vTokenContract: fakeContract,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: address,
      });

      throw new Error('borrow should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('throws a transaction error when Failure event is present', async () => {
    const fakeContract = {
      methods: {
        borrow: () => ({
          send: async () => ({
            events: {
              Failure: {
                returnValues: {
                  info: '1',
                  error: '1',
                },
              },
            },
          }),
        }),
      },
    } as unknown as VTokenContract<'xvs'>;

    try {
      await borrow({
        vTokenContract: fakeContract,
        amountWei: new BigNumber('10000000000000000'),
        fromAccountAddress: address,
      });

      throw new Error('borrow should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: ${TokenErrorReporterError[1]}]`);
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('transaction');
        expect(error.data.error).toBe(TokenErrorReporterError[1]);
        expect(error.data.info).toBe(TokenErrorReporterFailureInfo[1]);
      }
    }
  });

  test('returns transaction receipt when request succeeds', async () => {
    const fakeAmountWei = new BigNumber('10000000000000000');
    const fakeTransaction = { events: {} };
    const sendMock = jest.fn(async () => fakeTransaction);
    const borrowMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        borrow: borrowMock,
      },
    } as unknown as VTokenContract<'xvs'>;

    const response = await borrow({
      vTokenContract: fakeContract,
      amountWei: fakeAmountWei,
      fromAccountAddress: address,
    });

    expect(response).toBe(fakeTransaction);
    expect(borrowMock).toHaveBeenCalledTimes(1);
    expect(borrowMock).toHaveBeenCalledWith(fakeAmountWei.toFixed());
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
