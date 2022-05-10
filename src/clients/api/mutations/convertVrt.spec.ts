import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import address from '__mocks__/models/address';
import { VrtConverter } from 'types/contracts';
import getVTokenBalancesAll from '../queries/getVTokenBalancesAll';
import convertVrt from './convertVrt';

jest.mock('../queries/getVTokenBalancesAll');

const fakeAmount = '10000';

describe('api/mutation/convertVrt', () => {
  test('throws an error when request fails', async () => {
    (getVTokenBalancesAll as jest.Mock).mockImplementationOnce(async () => []);

    const fakeContract = {
      methods: {
        convert: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as VrtConverter;

    try {
      await convertVrt({
        vrtConverterContract: fakeContract,
        amountWei: fakeAmount,
        accountAddress: address,
      });

      throw new Error('convertVrt should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('send vrt conversion with correct arguments and returns transaction receipt when request succeeds', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const convertVrtMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        convert: convertVrtMock,
      },
    } as unknown as VrtConverter;

    const response = await convertVrt({
      vrtConverterContract: fakeContract,
      amountWei: fakeAmount,
      accountAddress: address,
    });

    expect(response).toBe(fakeTransactionReceipt);
    expect(convertVrtMock).toHaveBeenCalledTimes(1);
    expect(convertVrtMock).toHaveBeenCalledWith(fakeAmount);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: address });
  });
});
