import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VaiVault } from 'packages/contracts';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountWei: BigNumber;
}

export type WithdrawFromVaiVaultOutput = ContractTransaction;

const withdrawFromVaiVault = async ({
  vaiVaultContract,
  amountWei,
}: WithdrawFromVaiVaultInput): Promise<WithdrawFromVaiVaultOutput> =>
  vaiVaultContract.withdraw(amountWei.toFixed());

export default withdrawFromVaiVault;
