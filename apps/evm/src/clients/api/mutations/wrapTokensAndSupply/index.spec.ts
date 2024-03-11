import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';

import type { NativeTokenGateway } from 'libs/contracts';

import wrapTokensAndSupply from '.';

const fakeAmountMantissa = new BigNumber('10000000000000000');

vi.mock('libs/contracts');

describe('wrapTokensAndSupply', () => {
  it('returns transaction when request succeeds', async () => {
    const wrapAndSupplyMock = vi.fn(() => fakeContractTransaction);

    const fakeNativeTokenGatewayContract = {
      wrapAndSupply: wrapAndSupplyMock,
    } as unknown as NativeTokenGateway;

    const response = await wrapTokensAndSupply({
      accountAddress: fakeAddress,
      nativeTokenGatewayContract: fakeNativeTokenGatewayContract,
      amountMantissa: fakeAmountMantissa,
    });

    expect(response).toBe(fakeContractTransaction);

    expect(wrapAndSupplyMock).toHaveBeenCalledTimes(1);
    expect(wrapAndSupplyMock).toHaveBeenCalledWith(fakeAddress, {
      value: fakeAmountMantissa.toFixed(),
    });
  });
});
