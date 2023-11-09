import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { XvsVault } from 'packages/contracts';
import { Token } from 'types';

export interface StakeInXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardToken: Token;
  amountWei: BigNumber;
  poolIndex: number;
}

export type StakeInXvsVaultOutput = ContractTransaction;

const stakeInXvsVault = async ({
  xvsVaultContract,
  rewardToken,
  amountWei,
  poolIndex,
}: StakeInXvsVaultInput): Promise<StakeInXvsVaultOutput> =>
  xvsVaultContract.deposit(rewardToken.address, poolIndex, amountWei.toFixed());

export default stakeInXvsVault;
