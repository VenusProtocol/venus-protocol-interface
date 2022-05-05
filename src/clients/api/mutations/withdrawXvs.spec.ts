import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import address from '__mocks__/models/address';
import { XvsVesting } from 'types/contracts';
import getVTokenBalancesAll from '../queries/getVTokenBalancesAll';
import withdrawXvs from './withdrawXvs';

jest.mock('../queries/getVTokenBalancesAll');

describe('api/mutation/withdrawXvs', () => {
  test('throws an error when request fails', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => []);

    const fakeContract = {
      methods: {
        withdraw: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as XvsVesting;

    try {
      await withdrawXvs({
        xvsVestingContract: fakeContract,
        accountAddress: address,
      });

      throw new Error('withdrawXvs should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('send vrt conversion with correct arguments and returns transaction receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const withdrawVrtMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        withdraw: withdrawVrtMock,
      },
    } as unknown as XvsVesting;

    const response = await withdrawXvs({
      xvsVestingContract: fakeContract,
      accountAddress: address,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(withdrawVrtMock).toHaveBeenCalledTimes(1);
    expect(withdrawVrtMock).toHaveBeenCalledWith();
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
