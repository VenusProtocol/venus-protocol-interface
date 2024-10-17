import fakeZyFiWalletAddress from '__mocks__/models/address';
import { BigNumber as BN } from 'ethers';

import { MIN_PAYMASTER_BALANCE_MANTISSA } from 'constants/gasLess';
import type { ZyFiVault } from 'libs/contracts';

import BigNumber from 'bignumber.js';
import { getPaymasterInfo } from '..';

const fakeZyFiBalanceMantissa = MIN_PAYMASTER_BALANCE_MANTISSA;

describe('getPaymasterInfo', () => {
  it('returns Prime status of passed account', async () => {
    const fakeContract = {
      balances: vi.fn(() => BN.from(fakeZyFiBalanceMantissa.toFixed())),
    } as unknown as ZyFiVault;

    const response = await getPaymasterInfo({
      zyFiVaultContract: fakeContract,
      zyFiWalletAddress: fakeZyFiWalletAddress,
    });

    expect(fakeContract.balances).toHaveBeenCalledTimes(1);
    expect(fakeContract.balances).toHaveBeenCalledWith(fakeZyFiWalletAddress);
    expect(response).toEqual({
      balanceMantissa: new BigNumber(fakeZyFiBalanceMantissa),
      canSponsorTransactions: true,
    });
  });
});
