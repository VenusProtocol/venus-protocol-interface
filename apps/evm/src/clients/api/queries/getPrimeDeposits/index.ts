import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { primeLeaderboardAbi } from 'libs/contracts';

export interface PrimeDeposit {
  amountMantissa: BigNumber;
  timestampSeconds: number;
}

export interface GetPrimeDepositsInput {
  accountAddress: Address;
  primeLeaderboardContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeDepositsOutput {
  deposits: PrimeDeposit[];
}

export const getPrimeDeposits = async ({
  accountAddress,
  primeLeaderboardContractAddress,
  publicClient,
}: GetPrimeDepositsInput): Promise<GetPrimeDepositsOutput> => {
  const deposits = await publicClient.readContract({
    address: primeLeaderboardContractAddress,
    abi: primeLeaderboardAbi,
    functionName: 'getDeposits',
    args: [accountAddress],
  });

  return {
    deposits: deposits.map(deposit => ({
      amountMantissa: new BigNumber(deposit.amount.toString()),
      timestampSeconds: Number(deposit.timestamp),
    })),
  };
};
