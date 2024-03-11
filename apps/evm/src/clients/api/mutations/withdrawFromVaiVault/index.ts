import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { VaiVault } from 'libs/contracts';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountMantissa: BigNumber;
}

export type WithdrawFromVaiVaultOutput = ContractTransaction;

const withdrawFromVaiVault = async ({
  vaiVaultContract,
  amountMantissa,
}: WithdrawFromVaiVaultInput): Promise<WithdrawFromVaiVaultOutput> =>
  vaiVaultContract.withdraw(amountMantissa.toFixed());

export default withdrawFromVaiVault;
