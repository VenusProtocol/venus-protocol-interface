import BigNumber from 'bignumber.js';
import { checkForXvsVaultProxyTransactionError } from 'errors';
import { ContractReceipt } from 'ethers';
import { XvsVault } from 'packages/contracts';

export interface RequestWithdrawalFromXvsVaultInput {
  xvsVaultContract: XvsVault;
  rewardTokenAddress: string;
  poolIndex: number;
  amountWei: BigNumber;
}

export type RequestWithdrawalFromXvsVaultOutput = ContractReceipt;

const requestWithdrawalFromXvsVault = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  amountWei,
}: RequestWithdrawalFromXvsVaultInput): Promise<RequestWithdrawalFromXvsVaultOutput> => {
  const transaction = await xvsVaultContract.requestWithdrawal(
    rewardTokenAddress,
    poolIndex,
    amountWei.toFixed(),
  );
  const receipt = await transaction.wait(1);
  // TODO: remove check once this function has been refactored to use useSendTransaction hook
  return checkForXvsVaultProxyTransactionError(receipt);
};

export default requestWithdrawalFromXvsVault;
