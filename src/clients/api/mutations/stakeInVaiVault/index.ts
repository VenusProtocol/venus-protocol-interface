import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VaiVault } from 'packages/contracts';

export interface StakeInVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountWei: BigNumber;
}

export type StakeInVaiVaultOutput = ContractTransaction;

const stakeInVaiVault = async ({
  vaiVaultContract,
  amountWei,
}: StakeInVaiVaultInput): Promise<StakeInVaiVaultOutput> =>
  vaiVaultContract.deposit(amountWei.toFixed());

export default stakeInVaiVault;
