import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';
import type { ContractTransaction, Token } from 'types';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

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
  requestGaslessTransaction(
    xvsVaultContract,
    'deposit',
    rewardToken.address,
    poolIndex,
    amountMantissa.toFixed(),
  );

export default stakeInXvsVault;
