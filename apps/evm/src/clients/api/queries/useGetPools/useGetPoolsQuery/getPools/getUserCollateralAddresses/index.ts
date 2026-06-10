import { isolatedPoolComptrollerAbi, legacyPoolComptrollerAbi } from 'libs/contracts';
import type { ChainId } from 'types';
import { isPoolIsolated } from 'utilities';
import type { Address, PublicClient } from 'viem';
import type { ApiPool } from '../getApiPools';

export const getUserCollateralAddresses = async ({
  accountAddress,
  apiPools,
  chainId,
  publicClient,
  legacyPoolComptrollerContractAddress,
}: {
  accountAddress: Address;
  apiPools: ApiPool[];
  chainId: ChainId;
  publicClient: PublicClient;
  legacyPoolComptrollerContractAddress?: Address;
}) => {
  const getAssetsInPromises: Promise<readonly string[]>[] = [];

  apiPools.forEach(pool => {
    const isIsolated = isPoolIsolated({
      chainId,
      comptrollerAddress: pool.address,
    });

    if (!isIsolated) {
      return;
    }

    if (accountAddress) {
      getAssetsInPromises.push(
        publicClient.readContract({
          abi: isolatedPoolComptrollerAbi,
          address: pool.address,
          functionName: 'getAssetsIn',
          args: [accountAddress],
        }),
      );
    }
  });

  if (accountAddress && legacyPoolComptrollerContractAddress) {
    getAssetsInPromises.push(
      publicClient.readContract({
        abi: legacyPoolComptrollerAbi,
        address: legacyPoolComptrollerContractAddress,
        functionName: 'getAssetsIn',
        args: [accountAddress],
      }),
    );
  }

  const results = await Promise.all(getAssetsInPromises);

  return { userCollateralAddresses: results.flat() };
};
