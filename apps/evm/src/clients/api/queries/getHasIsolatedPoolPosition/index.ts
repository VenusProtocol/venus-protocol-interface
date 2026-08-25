import { poolLensAbi } from 'libs/contracts';
import { areAddressesEqual } from 'utilities';
import type { Address, PublicClient } from 'viem';

export interface GetHasIsolatedPoolPositionInput {
  publicClient: PublicClient;
  accountAddress: Address;
  poolLensContractAddress: Address;
  poolRegistryContractAddress: Address;
  corePoolComptrollerContractAddress: Address;
}

export interface GetHasIsolatedPoolPositionOutput {
  hasPosition: boolean;
}

export const getHasIsolatedPoolPosition = async ({
  publicClient,
  accountAddress,
  poolLensContractAddress,
  poolRegistryContractAddress,
  corePoolComptrollerContractAddress,
}: GetHasIsolatedPoolPositionInput): Promise<GetHasIsolatedPoolPositionOutput> => {
  const pools = await publicClient.readContract({
    abi: poolLensAbi,
    address: poolLensContractAddress,
    functionName: 'getAllPools',
    args: [poolRegistryContractAddress],
  });

  const isolatedPoolVTokenAddresses = pools
    .filter(pool => !areAddressesEqual(pool.comptroller, corePoolComptrollerContractAddress))
    .flatMap(pool => pool.vTokens.map(({ vToken }) => vToken));

  if (isolatedPoolVTokenAddresses.length === 0) {
    return { hasPosition: false };
  }

  const { result: vTokenBalances } = await publicClient.simulateContract({
    abi: poolLensAbi,
    address: poolLensContractAddress,
    functionName: 'vTokenBalancesAll',
    args: [isolatedPoolVTokenAddresses, accountAddress],
  });

  return {
    hasPosition: vTokenBalances.some(
      ({ balanceOf, borrowBalanceCurrent }) => balanceOf > 0n || borrowBalanceCurrent > 0n,
    ),
  };
};
