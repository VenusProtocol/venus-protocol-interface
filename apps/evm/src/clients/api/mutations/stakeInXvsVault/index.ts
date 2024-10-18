import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';
import type { ContractTxData, Token } from 'types';

export interface StakeInXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardToken: Token;
  amountMantissa: BigNumber;
  poolIndex: number;
}

export type StakeInXvsVaultOutput = ContractTxData<XvsVault, 'deposit'>;

const stakeInXvsVault = ({
  xvsVaultContract,
  rewardToken,
  amountMantissa,
  poolIndex,
}: StakeInXvsVaultInput): StakeInXvsVaultOutput => ({
  contract: xvsVaultContract,
  methodName: 'deposit',
  args: [rewardToken.address, poolIndex, amountMantissa.toFixed()],
});

export default stakeInXvsVault;
