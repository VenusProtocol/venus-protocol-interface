import BigNumber from 'bignumber.js';
import { vrtConverterAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface VrtConversionRatioInput {
  publicClient: PublicClient;
  vrtConverterAddress: Address;
}

export type GetVrtConversionRatioOutput = {
  conversionRatio: BigNumber;
};

export const getVrtConversionRatio = async ({
  publicClient,
  vrtConverterAddress,
}: VrtConversionRatioInput): Promise<GetVrtConversionRatioOutput> => {
  const conversionRatio = await publicClient.readContract({
    address: vrtConverterAddress,
    abi: vrtConverterAbi,
    functionName: 'conversionRatio',
  });

  return { conversionRatio: new BigNumber(conversionRatio.toString()) };
};
