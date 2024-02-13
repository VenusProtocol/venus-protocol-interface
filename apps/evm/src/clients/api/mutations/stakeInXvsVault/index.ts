import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { XvsVault } from 'libs/contracts';

import { Token } from 'types';

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
