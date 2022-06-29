import { GetXvsVaultWithdrawalRequestsInput, GetXvsVaultWithdrawalRequestsOutput } from './types';
import formatToWithdrawalRequest from './formatToWithdrawalRequest';

export * from './types';

const getXvsVaultWithdrawalRequests = async ({
  xvsVaultContract,
  rewardTokenAddress,
  poolIndex,
  accountAddress,
}: GetXvsVaultWithdrawalRequestsInput): Promise<GetXvsVaultWithdrawalRequestsOutput> => {
  const res = await xvsVaultContract.methods
    .getWithdrawalRequests(rewardTokenAddress, poolIndex, accountAddress)
    .call();

  return res.map(formatToWithdrawalRequest);
};

export default getXvsVaultWithdrawalRequests;
