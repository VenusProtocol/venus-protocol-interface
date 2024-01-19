import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { VaiVault } from 'packages/contracts';

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
