import type BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  amountMantissa: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = ContractTxData<XvsVault, 'requestWithdrawal'>;

const requestWithdrawalFromXvsVault = ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  amountMantissa,
}: RequestWithdrawalFromXvsVaultInput): RequestWithdrawalFromXvsVaultOutput => ({
  contract: xvsVaultContract,
  methodName: 'requestWithdrawal',
  args: [rewardTokenAddress, poolIndex, amountMantissa.toFixed()],
});

export default requestWithdrawalFromXvsVault;
