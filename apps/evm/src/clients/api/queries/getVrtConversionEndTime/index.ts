import { vrtConverterAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVrtConversionEndTimeInput {
  publicClient: PublicClient;
  vrtConverterAddress: Address;
}

export type GetVrtConversionEndTimeOutput = {
  conversionEndTime: Date;
};

export const getVrtConversionEndTime = async ({
  publicClient,
  vrtConverterAddress,
}: GetVrtConversionEndTimeInput): Promise<GetVrtConversionEndTimeOutput> => {
  const resp = await publicClient.readContract({
    address: vrtConverterAddress,
    abi: vrtConverterAbi,
    functionName: 'conversionEndTime',
  });

  // End date is returned as unix timestamp
  return {
    conversionEndTime: new Date(Number(resp) * 1000),
  };
};
