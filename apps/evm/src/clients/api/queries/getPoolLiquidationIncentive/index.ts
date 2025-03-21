import BigNumber from 'bignumber.js';
import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { isolatedPoolComptrollerAbi } from 'libs/contracts';
import { convertPercentageFromSmartContract } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetPoolLiquidationIncentiveInput {
  publicClient: PublicClient;
  poolComptrollerContractAddress: Address;
}

export type GetPoolLiquidationIncentiveOutput = {
  liquidationIncentivePercentage: number;
};

export const getPoolLiquidationIncentive = async ({
  publicClient,
  poolComptrollerContractAddress,
}: GetPoolLiquidationIncentiveInput): Promise<GetPoolLiquidationIncentiveOutput> => {
  const liquidationIncentiveMantissa = await publicClient.readContract({
    address: poolComptrollerContractAddress,
    abi: isolatedPoolComptrollerAbi,
    functionName: 'liquidationIncentiveMantissa',
  });

  const liquidationIncentivePercentage = convertPercentageFromSmartContract(
    new BigNumber(liquidationIncentiveMantissa.toString()).minus(COMPOUND_MANTISSA),
  );

  return {
    liquidationIncentivePercentage,
  };
};
