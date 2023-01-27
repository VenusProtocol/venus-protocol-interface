import BigNumber from 'bignumber.js';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { VrtConverter } from 'types/contracts';

import convertVrt from '.';

const fakeAmount = new BigNumber('10000');

describe('api/mutation/convertVrt', () => {
  test('send vrt conversion with correct arguments and returns contract receipt when request succeeds', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const convertVrtMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      convert: convertVrtMock,
    } as unknown as VrtConverter;

    const response = await convertVrt({
      vrtConverterContract: fakeContract,
      amountWei: fakeAmount,
    });

    expect(response).toBe(fakeContractReceipt);
    expect(convertVrtMock).toHaveBeenCalledTimes(1);
    expect(convertVrtMock).toHaveBeenCalledWith(fakeAmount.toFixed());
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
