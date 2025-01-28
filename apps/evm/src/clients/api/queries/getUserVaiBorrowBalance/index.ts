import BigNumber from 'bignumber.js';
import { vaiControllerAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { Address, PublicClient } from 'viem';

export interface GetUserVaiBorrowBalanceInput {
  accountAddress: Address;
  vaiControllerContractAddress: Address;
}

export type GetUserVaiBorrowBalanceOutput = {
  userVaiBorrowBalanceMantissa: BigNumber;
};

export const getUserVaiBorrowBalance = async ({
  accountAddress,
  publicClient,
  vaiControllerContractAddress,
}: {
  accountAddress: Address;
  publicClient: PublicClient;
  vaiControllerContractAddress: Address;
}) => {
  const vaiContractSettings = { abi: vaiControllerAbi, address: vaiControllerContractAddress };

  const [_accrueVaiInterestResult, getVAIRepayAmountResult] = await publicClient.multicall({
    contracts: [
      // Call (statically) accrueVAIInterest to calculate past accrued interests before fetching all
      // interests. Both requests need to happen within the same block so we use the multicall
      // function.
      {
        ...vaiContractSettings,
        functionName: 'accrueVAIInterest',
      },
      {
        ...vaiContractSettings,
        functionName: 'getVAIRepayAmount',
        args: [accountAddress],
      },
    ],
  });

  if (getVAIRepayAmountResult.status === 'failure') {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const userVaiBorrowBalanceMantissa = new BigNumber(getVAIRepayAmountResult.result.toString());

  return { userVaiBorrowBalanceMantissa };
};
