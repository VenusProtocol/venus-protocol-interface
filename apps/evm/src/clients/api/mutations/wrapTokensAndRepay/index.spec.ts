import BigNumber from 'bignumber.js';

import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { NativeTokenGateway } from 'libs/contracts';

import wrapTokensAndRepay from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('libs/contracts');

describe('wrapTokensAndRepay', () => {
  it('returns transaction when request succeeds', async () => {
    const wrapAndRepayMock = vi.fn(() => fakeContractTransaction);

    const fakeNativeTokenGatewayContract = {
      wrapAndRepay: wrapAndRepayMock,
    } as unknown as NativeTokenGateway;

    const response = await wrapTokensAndRepay({
      nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);

    expect(wrapAndRepayMock).toHaveBeenCalledTimes(1);
    expect(wrapAndRepayMock).toHaveBeenCalledWith({
      value: fakeAmountMantissa.toFixed(),
    });
  });
});
