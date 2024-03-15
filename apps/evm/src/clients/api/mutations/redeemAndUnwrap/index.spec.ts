import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { NativeTokenGateway } from 'libs/contracts';

import redeemAndUnwrap from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('libs/contracts');

describe('redeemAndUnwrap', () => {
  it('returns transaction when request succeeds', async () => {
    const redeemAndUnwrapMock = vi.fn(() => fakeContractTransaction);

    const fakeNativeTokenGatewayContract = {
      redeemAndUnwrap: redeemAndUnwrapMock,
    } as unknown as NativeTokenGateway;

    const response = await redeemAndUnwrap({
      nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);

    expect(redeemAndUnwrapMock).toHaveBeenCalledTimes(1);
    expect(redeemAndUnwrapMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
