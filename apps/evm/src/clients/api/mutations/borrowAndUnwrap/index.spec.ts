import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { NativeTokenGateway } from 'libs/contracts';

import borrowAndUnwrap from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('libs/contracts');

describe('borrowAndUnwrap', () => {
  it('returns transaction when request succeeds', async () => {
    const borrowAndUnwrapMock = vi.fn(() => fakeContractTransaction);

    const fakeNativeTokenGatewayContract = {
      borrowAndUnwrap: borrowAndUnwrapMock,
    } as unknown as NativeTokenGateway;

    const response = await borrowAndUnwrap({
      nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);

    expect(borrowAndUnwrapMock).toHaveBeenCalledTimes(1);
    expect(borrowAndUnwrapMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
