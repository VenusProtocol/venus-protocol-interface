import { useGetImportablePositions, useGetPools } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';
import type { ImportableProtocol } from 'types';
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

  console.log('importablePositions', importablePositions);

  const { data: poolData } = useGetPools({
    accountAddress,
  });

  // Map highest supply APY assets by address
  const highestSupplyApyAssetMapping: AssetMapping = {};

  poolData?.pools.forEach(pool =>
    pool.assets.forEach(asset => {
      const tokenAddress = asset.vToken.underlyingToken.address.toLowerCase() as Address;

      if (
        !Object.prototype.hasOwnProperty.call(highestSupplyApyAssetMapping, tokenAddress) ||
        highestSupplyApyAssetMapping[tokenAddress].supplyApyPercentage.isLessThan(
          asset.supplyApyPercentage,
        )
      ) {
        highestSupplyApyAssetMapping[tokenAddress] = asset;
        return;
      }
    }),
  );

  const supplyPositions: {
    [protocol in ImportableProtocol]: ProfitableSupplyPosition[];
  } = {
    aave: filterProfitableImports({
      importablePositions: importablePositions?.aave || [],
      highestSupplyApyAssetMapping,
    }),
  };

  return {
    supplyPositions,
  };
};
