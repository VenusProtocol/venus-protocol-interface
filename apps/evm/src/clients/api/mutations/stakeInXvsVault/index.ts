import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { XvsVault } from 'libs/contracts';
import type { Token } from 'types';

export interface StakeInXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardToken: Token;
  amountMantissa: BigNumber;
  poolIndex: number;
}

export type StakeInXvsVaultOutput = ContractTransaction;

const stakeInXvsVault = async ({
  xvsVaultContract,
  rewardToken,
  amountMantissa,
  poolIndex,
}: StakeInXvsVaultInput): Promise<StakeInXvsVaultOutput> =>
  xvsVaultContract.deposit(rewardToken.address, poolIndex, amountMantissa.toFixed());

export default stakeInXvsVault;
