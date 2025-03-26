import BigNumber from 'bignumber.js';
import { vaiControllerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetVaiTreasuryPercentageInput {
  publicClient: PublicClient;
  vaiControllerAddress: Address;
}

export type GetVaiTreasuryPercentageOutput = {
  percentage: BigNumber;
};

export const getVaiTreasuryPercentage = async ({
  publicClient,
  vaiControllerAddress,
}: GetVaiTreasuryPercentageInput): Promise<GetVaiTreasuryPercentageOutput> => {
  const treasuryPercentage = await publicClient.readContract({
    address: vaiControllerAddress,
    abi: vaiControllerAbi,
    functionName: 'treasuryPercent',
  });

  const formattedTreasuryPercentage = new BigNumber(treasuryPercentage.toString())
    .times(100)
    .div(1e18);

  return {
    percentage: formattedTreasuryPercentage,
  };
};
