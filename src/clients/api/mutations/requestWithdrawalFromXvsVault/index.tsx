import BigNumber from 'bignumber.js';
import { VError, checkForXvsVaultTransactionError } from 'errors';
import type { TransactionReceipt } from 'web3-core/types';

import { XvsVault } from 'types/contracts';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  fromAccountAddress: string;
  rewardTokenAddress: string;
  poolIndex: number;
  amountWei: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = TransactionReceipt;

const requestWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  fromAccountAddress,
  rewardTokenAddress,
  poolIndex,
  amountWei,
}: RequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> => {
  const getContractFn = () =>
    xvsVaultContract.methods.requestWithdrawal(rewardTokenAddress, poolIndex, amountWei.toFixed());

  try {
    // Statically call function to see if it reverts with error about
    // withdrawals needing to be executed. This is a fix following the upgrade
    // of the XvsVault contract
    await getContractFn().call({ from: fromAccountAddress });
  } catch (error) {
    if (
      (error as Error).message.includes(
        'execute existing withdrawal before requesting new withdrawal',
      )
    ) {
      throw new VError({
        type: 'transaction',
        code: 'UNAUTHORIZED',
        data: {
          error: 'UNAUTHORIZED',
          info: 'COMPLETE_CURRENT_WITHDRAWAL_REQUESTS',
        },
      });
    }
  }

  const res = await getContractFn().send({ from: fromAccountAddress });

  return checkForXvsVaultTransactionError(res);
};

export default requestWithdrawalFromXvsVault;
