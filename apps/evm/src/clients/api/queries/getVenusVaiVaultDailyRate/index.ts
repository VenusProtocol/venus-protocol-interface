import BigNumber from 'bignumber.js';
import { legacyPoolComptrollerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVenusVaiVaultDailyRateInput {
  publicClient: PublicClient;
  legacyPoolComptrollerAddress: Address;
  blocksPerDay: number;
}

export type GetVenusVaiVaultDailyRateOutput = {
  dailyRateMantissa: BigNumber;
};

export const getVenusVaiVaultDailyRate = async ({
  blocksPerDay,
  publicClient,
  legacyPoolComptrollerAddress,
}: GetVenusVaiVaultDailyRateInput): Promise<GetVenusVaiVaultDailyRateOutput> => {
  const resp = await publicClient.readContract({
    address: legacyPoolComptrollerAddress,
    abi: legacyPoolComptrollerAbi,
    functionName: 'venusVAIVaultRate',
  });

  return {
    dailyRateMantissa: new BigNumber(resp.toString()).times(blocksPerDay),
  };
};
