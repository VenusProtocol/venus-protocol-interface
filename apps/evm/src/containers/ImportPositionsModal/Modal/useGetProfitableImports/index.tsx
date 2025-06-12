import { useGetImportablePositions, useGetPools } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useAccountAddress } from 'libs/wallet';
import type { ImportableProtocol } from 'types';
import type { Address } from 'viem';
import type { PositionProps } from '../ImportablePositions/Position';
import { type AssetMapping, filterProfitableImports } from './filterProfitableImports';

// TODO: add tests

export const useGetProfitableImports = () => {
  const { accountAddress } = useAccountAddress();

  const { data: importablePositions } = useGetImportablePositions(
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
    [protocol in ImportableProtocol]: PositionProps[];
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
