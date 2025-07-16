import { useGetImportablePositions, useGetPools } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useAccountAddress } from 'libs/wallet';
import type { ImportableProtocol } from 'types';
import { getBoostedAssetSupplyApy } from 'utilities';
import type { Address } from 'viem';
import { type AssetMapping, formatProfitableImports } from './formatProfitableImports';
import type { ProfitableSupplyPosition } from './types';

export * from './types';

export const useGetProfitableImports = () => {
  const { accountAddress } = useAccountAddress();

  const { data: importablePositions, isLoading } = useGetImportablePositions(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { data: poolData } = useGetPools({
    accountAddress,
  });

  const sortedSupplyApyAssetMapping: AssetMapping = {};

  // Group assets by underlying token address
  poolData?.pools.forEach(pool =>
    pool.assets.forEach(asset => {
      const tokenAddress = asset.vToken.underlyingToken.address.toLowerCase() as Address;

      if (!Object.prototype.hasOwnProperty.call(sortedSupplyApyAssetMapping, tokenAddress)) {
        sortedSupplyApyAssetMapping[tokenAddress] = [];
      }

      sortedSupplyApyAssetMapping[tokenAddress].push(asset);
    }),
  );

  // Sort assets from highest to lowest supply APY
  Object.keys(sortedSupplyApyAssetMapping).forEach(tokenAddress => {
    sortedSupplyApyAssetMapping[tokenAddress as Address].sort((assetA, assetB) => {
      const { supplyApyPercentage: a } = getBoostedAssetSupplyApy({ asset: assetA });
      const { supplyApyPercentage: b } = getBoostedAssetSupplyApy({ asset: assetB });

      return b.minus(a).toNumber();
    });
  });

  const supplyPositions: {
    [protocol in ImportableProtocol]: ProfitableSupplyPosition[];
  } = {
    aave: formatProfitableImports({
      importablePositions: importablePositions?.aave || [],
      sortedSupplyApyAssetMapping,
    }),
    morpho: formatProfitableImports({
      importablePositions: importablePositions?.morpho || [],
      sortedSupplyApyAssetMapping,
    }),
  };

  const importablePositionsCount = Object.values(supplyPositions).reduce(
    (acc, positions) => acc + positions.length,
    0,
  );

  return {
    isLoading,
    supplyPositions,
    importablePositionsCount,
  };
};
