import BigNumber from 'bignumber.js';
import { vaiControllerAbi } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetVaiRepayAprInput {
  publicClient: PublicClient;
  vaiControllerAddress: Address;
}

export interface GetVaiRepayAprOutput {
  repayAprPercentage: BigNumber;
}

export const getVaiRepayApr = async ({
  publicClient,
  vaiControllerAddress,
}: GetVaiRepayAprInput): Promise<GetVaiRepayAprOutput> => {
  const vaiRepayRateMantissa = await publicClient.readContract({
    address: vaiControllerAddress,
    abi: vaiControllerAbi,
    functionName: 'getVAIRepayRate',
  });

  const vaiRepayAprPercentage = new BigNumber(
    convertPercentageFromSmartContract(vaiRepayRateMantissa.toString()),
  );

  return {
    repayAprPercentage: vaiRepayAprPercentage,
  };
};
