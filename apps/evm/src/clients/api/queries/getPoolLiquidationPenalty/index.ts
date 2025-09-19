import BigNumber from 'bignumber.js';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetPoolLiquidationPenaltyInput {
  publicClient: PublicClient;
  poolComptrollerContractAddress: Address;
}

export type GetPoolLiquidationPenaltyOutput = {
  liquidationPenaltyPercentage: number;
};

export const getPoolLiquidationPenalty = async ({
  publicClient,
  poolComptrollerContractAddress,
}: GetPoolLiquidationPenaltyInput): Promise<GetPoolLiquidationPenaltyOutput> => {
  const liquidationIncentiveMantissa = await publicClient.readContract({
    address: poolComptrollerContractAddress,
    abi: isolatedPoolComptrollerAbi,
    functionName: 'liquidationIncentiveMantissa',
  });

  const liquidationPenaltyPercentage = convertPercentageFromSmartContract(
    new BigNumber(liquidationIncentiveMantissa.toString()).minus(COMPOUND_MANTISSA),
  );

  return {
    liquidationPenaltyPercentage,
  };
};
