import { spokeComptrollerAbi } from 'libs/contracts';
import type { Address, PublicClient } from 'viem';

import type { ApiSpokePool } from '../types';

export interface GetSpokeSupplyAllowlistInput {
  publicClient: PublicClient;
  apiPools: ApiSpokePool[];
  accountAddress: Address;
}

// Keyed by lowercased vToken address
export type GetSpokeSupplyAllowlistOutput = Record<string, boolean>;

export const getSpokeSupplyAllowlist = async ({
  publicClient,
  apiPools,
  accountAddress,
}: GetSpokeSupplyAllowlistInput): Promise<GetSpokeSupplyAllowlistOutput> => {
  // Only collateral-side markets with an allowlist can restrict the connected wallet
  const allowlistedMarkets = apiPools.flatMap(apiPool =>
    apiPool.markets
      .filter(({ isListed, side, supplyAllowlistEnabled }) => {
        return isListed && side === 'collateral' && supplyAllowlistEnabled;
      })
      .map(apiMarket => ({
        comptrollerAddress: apiPool.address,
        vTokenAddress: apiMarket.address,
      })),
  );

  const isAllowedSupplierResults = await Promise.all(
    allowlistedMarkets.map(({ comptrollerAddress, vTokenAddress }) =>
      publicClient.readContract({
        abi: spokeComptrollerAbi,
        address: comptrollerAddress,
        functionName: 'isAllowedSupplier',
        args: [vTokenAddress, accountAddress],
      }),
    ),
  );

  return allowlistedMarkets.reduce<GetSpokeSupplyAllowlistOutput>(
    (acc, { vTokenAddress }, index) => ({
      ...acc,
      [vTokenAddress.toLowerCase()]: isAllowedSupplierResults[index] === true,
    }),
    {},
  );
};
