import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { VaiVault } from 'packages/contracts';

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
