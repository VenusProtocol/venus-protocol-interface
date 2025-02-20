import fakeZyFiWalletAddress from '__mocks__/models/address';

import { MIN_PAYMASTER_BALANCE_MANTISSA } from 'constants/gasLess';

import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';
import { getPaymasterInfo } from '..';

const fakeZyFiBalanceMantissa = MIN_PAYMASTER_BALANCE_MANTISSA;

describe('getPaymasterInfo', () => {
  it('returns paymaster info', async () => {
    const readContractMock = vi.fn(async () => BigInt(fakeZyFiBalanceMantissa.toFixed()));

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const fakeZyFiVaultContractAddress = '0x1234';

    const response = await getPaymasterInfo({
      publicClient: fakePublicClient,
      zyFiVaultContractAddress: fakeZyFiVaultContractAddress,
      zyFiWalletAddress: fakeZyFiWalletAddress,
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeZyFiVaultContractAddress,
      abi: expect.any(Array),
      functionName: 'balances',
      args: [fakeZyFiWalletAddress],
    });
    expect(response).toEqual({
      balanceMantissa: new BigNumber(fakeZyFiBalanceMantissa),
      canSponsorTransactions: true,
    });
  });
});
