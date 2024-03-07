import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import { NativeTokenGateway } from 'libs/contracts';

import redeemAndUnwrap from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('libs/contracts');

describe('redeemAndUnwrap', () => {
  it('returns transaction when request succeeds', async () => {
    const redeemUnderlyingAndUnwrapMock = vi.fn(() => fakeContractTransaction);

    const fakeNativeTokenGatewayContract = {
      redeemUnderlyingAndUnwrap: redeemUnderlyingAndUnwrapMock,
    } as unknown as NativeTokenGateway;

    const response = await redeemAndUnwrap({
      nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);

    expect(redeemUnderlyingAndUnwrapMock).toHaveBeenCalledTimes(1);
    expect(redeemUnderlyingAndUnwrapMock).toHaveBeenCalledWith(fakeAmountMantissa.toFixed());
  });
});
