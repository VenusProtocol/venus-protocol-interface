import type { Asset, ImportableSupplyPosition } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  getBoostedAssetSupplyApy,
} from 'utilities';
import type { Address } from 'viem';
import type { ProfitableSupplyPosition } from '../types';

export type AssetMapping = {
  [tokenAddress: Address]: Asset[];
};

export const filterProfitableImports = ({
  importablePositions,
  sortedSupplyApyAssetMapping,
}: {
  importablePositions: ImportableSupplyPosition[];
  sortedSupplyApyAssetMapping: AssetMapping;
}) =>
  importablePositions.reduce<ProfitableSupplyPosition[]>((acc, position) => {
    const tokenAddress = position.tokenAddress.toLowerCase() as Address;

    if (!Object.prototype.hasOwnProperty.call(sortedSupplyApyAssetMapping, tokenAddress)) {
      return acc;
    }

    // Find Venus asset with better supply APY than current protocol
    const sortedAssets = sortedSupplyApyAssetMapping[tokenAddress];
    const profitableAsset = sortedAssets.find(asset => {
      const { supplyApyPercentage } = getBoostedAssetSupplyApy({ asset });

      const hasBetterSupplyApy = supplyApyPercentage.isGreaterThan(position.supplyApyPercentage);

      const isNotCapped = convertTokensToMantissa({
        value: asset.supplyCapTokens,
        token: asset.vToken.underlyingToken,
      }).isGreaterThanOrEqualTo(position.userSupplyBalanceMantissa);

      return hasBetterSupplyApy && isNotCapped;
    });

    if (!profitableAsset) {
      return acc;
    }

    const userSupplyBalanceTokens = convertMantissaToTokens({
      value: position.userSupplyBalanceMantissa,
      token: profitableAsset.vToken.underlyingToken,
    });

    const positionProps: ProfitableSupplyPosition = {
      asset: profitableAsset,
      userSupplyBalanceTokens,
      currentSupplyApyPercentage: position.supplyApyPercentage,
      supplyPosition: position,
    };

    return [...acc, positionProps];
  }, []);
