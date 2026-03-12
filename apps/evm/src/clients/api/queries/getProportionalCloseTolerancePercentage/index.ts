import BigNumber from 'bignumber.js';
import { relativePositionManagerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

const PROPORTIONAL_CLOSE_TOLERANCE_DIVISOR = 100;

export interface GetProportionalCloseTolerancePercentageInput {
  publicClient: PublicClient;
  relativePositionManagerAddress: Address;
}

export type GetProportionalCloseTolerancePercentageOutput = {
  proportionalCloseTolerancePercentage: number;
};

export const getProportionalCloseTolerancePercentage = async ({
  publicClient,
  relativePositionManagerAddress,
}: GetProportionalCloseTolerancePercentageInput): Promise<GetProportionalCloseTolerancePercentageOutput> => {
  const proportionalCloseTolerance = await publicClient.readContract({
    address: relativePositionManagerAddress,
    abi: relativePositionManagerAbi,
    functionName: 'proportionalCloseTolerance',
  });

  const proportionalCloseTolerancePercentage = new BigNumber(proportionalCloseTolerance.toString())
    .div(PROPORTIONAL_CLOSE_TOLERANCE_DIVISOR)
    .toNumber();

  return {
    proportionalCloseTolerancePercentage,
  };
};
