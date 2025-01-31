import BigNumber from 'bignumber.js';
import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetIsolatedPoolVTokenLiquidationThresholdInput {
  publicClient: PublicClient;
  poolComptrollerContractAddress: Address;
  vTokenAddress: Address;
}

export type GetIsolatedPoolVTokenLiquidationThresholdOutput = {
  liquidationThresholdPercentage: number;
};

export const getIsolatedPoolVTokenLiquidationThreshold = async ({
  publicClient,
  poolComptrollerContractAddress,
  vTokenAddress,
}: GetIsolatedPoolVTokenLiquidationThresholdInput): Promise<GetIsolatedPoolVTokenLiquidationThresholdOutput> => {
  const [_1, _2, liquidationThresholdMantissa] = await publicClient.readContract({
    address: poolComptrollerContractAddress,
    abi: isolatedPoolComptrollerAbi,
    functionName: 'markets',
    args: [vTokenAddress],
  });

  const liquidationThresholdPercentage = convertPercentageFromSmartContract(
    new BigNumber(liquidationThresholdMantissa.toString()),
  );

  return {
    liquidationThresholdPercentage,
  };
};
