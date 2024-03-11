import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { VaiVault } from 'libs/contracts';

export interface StakeInVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountMantissa: BigNumber;
}

export type StakeInVaiVaultOutput = ContractTransaction;

const stakeInVaiVault = async ({
  vaiVaultContract,
  amountMantissa,
}: StakeInVaiVaultInput): Promise<StakeInVaiVaultOutput> =>
  vaiVaultContract.deposit(amountMantissa.toFixed());

export default stakeInVaiVault;
