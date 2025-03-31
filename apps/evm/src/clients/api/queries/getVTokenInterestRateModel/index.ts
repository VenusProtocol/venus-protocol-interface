import { vBep20Abi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVTokenInterestRateModelInput {
  publicClient: PublicClient;
  vTokenAddress: Address;
}

export type GetVTokenInterestRateModelOutput = {
  contractAddress: Address;
};

export const getVTokenInterestRateModel = async ({
  publicClient,
  vTokenAddress,
}: GetVTokenInterestRateModelInput): Promise<GetVTokenInterestRateModelOutput> => {
  const contractAddress = await publicClient.readContract({
    address: vTokenAddress,
    abi: vBep20Abi,
    functionName: 'interestRateModel',
  });

  return {
    contractAddress,
  };
};
