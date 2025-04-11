import BigNumber from 'bignumber.js';
import { xvsVestingAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetXvsWithdrawableAmountInput {
  accountAddress: Address;
  publicClient: PublicClient;
  xvsVestingContractAddress: Address;
}

export interface GetXvsWithdrawableAmountOutput {
  totalWithdrawableAmount: BigNumber;
  totalVestedAmount: BigNumber;
  totalWithdrawnAmount: BigNumber;
}

export const getXvsWithdrawableAmount = async ({
  publicClient,
  xvsVestingContractAddress,
  accountAddress,
}: GetXvsWithdrawableAmountInput): Promise<GetXvsWithdrawableAmountOutput | undefined> => {
  const [totalWithdrawableAmount, totalVestedAmount, totalWithdrawnAmount] =
    await publicClient.readContract({
      address: xvsVestingContractAddress,
      abi: xvsVestingAbi,
      functionName: 'getWithdrawableAmount',
      args: [accountAddress],
    });

  return {
    totalWithdrawableAmount: new BigNumber(totalWithdrawableAmount.toString()),
    totalVestedAmount: new BigNumber(totalVestedAmount.toString()),
    totalWithdrawnAmount: new BigNumber(totalWithdrawnAmount.toString()),
  };
};
