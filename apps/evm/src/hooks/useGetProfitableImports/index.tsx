import { useGetImportablePositions, useGetPools } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';
import type { ImportableProtocol } from 'types';
import { getBoostedAssetSupplyApy } from 'utilities';
import type { Address } from 'viem';
import { type AssetMapping, filterProfitableImports } from './filterProfitableImports';
import type { ProfitableSupplyPosition } from './types';

export * from './types';

export const useGetProfitableImports = () => {
  const { accountAddress } = useAccountAddress();

  const isImportPositionsFeatureEnabled = useIsFeatureEnabled({
    name: 'importPositions',
  });

  const { data: importablePositions } = useGetImportablePositions(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: isImportPositionsFeatureEnabled && !!accountAddress,
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
    aave: filterProfitableImports({
      importablePositions: importablePositions?.aave || [],
      sortedSupplyApyAssetMapping,
    }),
  };

  const importablePositionsCount = Object.values(supplyPositions).reduce(
    (acc, positions) => acc + positions.length,
    0,
  );

  return {
    supplyPositions,
    importablePositionsCount,
  };
};
