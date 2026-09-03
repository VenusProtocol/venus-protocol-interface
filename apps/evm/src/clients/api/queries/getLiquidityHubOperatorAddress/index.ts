import { liquidityHubAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

export interface GetLiquidityHubOperatorAddressInput {
  publicClient: PublicClient;
  vhTokenAddress: Address;
}

export type GetLiquidityHubOperatorAddressOutput = {
  operatorAddress: Address;
};

export const getLiquidityHubOperatorAddress = async ({
  publicClient,
  vhTokenAddress,
}: GetLiquidityHubOperatorAddressInput): Promise<GetLiquidityHubOperatorAddressOutput> => {
  // The hub exposes no operator getter: it is owned by the Venus DAO timelock, which is the
  // entity operating it
  const operatorAddress = await publicClient.readContract({
    address: vhTokenAddress,
    abi: liquidityHubAbi,
    functionName: 'owner',
  });

  return {
    operatorAddress,
  };
};
