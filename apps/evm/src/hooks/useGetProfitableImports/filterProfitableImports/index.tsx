import {
  MAX_POSITION_SUPPLY_BALANCE_CENTS,
  MIN_POSITION_SUPPLY_BALANCE_CENTS,
} from 'constants/importPositions';
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

    const sortedAssets = sortedSupplyApyAssetMapping[tokenAddress];
    const userSupplyBalanceTokens = convertMantissaToTokens({
      value: position.userSupplyBalanceMantissa,
      token: sortedAssets[0].vToken.underlyingToken,
    });

    // Skip position if it's outside boundaries
    const positionSupplyBalanceCents =
      sortedAssets[0].tokenPriceCents.multipliedBy(userSupplyBalanceTokens);

    if (
      positionSupplyBalanceCents.isLessThan(MIN_POSITION_SUPPLY_BALANCE_CENTS.toString()) ||
      positionSupplyBalanceCents.isGreaterThan(MAX_POSITION_SUPPLY_BALANCE_CENTS.toString())
    ) {
      return acc;
    }

    // Find Venus asset with better supply APY than current protocol
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

    const positionProps: ProfitableSupplyPosition = {
      asset: profitableAsset,
      userSupplyBalanceTokens,
      currentSupplyApyPercentage: position.supplyApyPercentage,
      supplyPosition: position,
    };

    return [...acc, positionProps];
  }, []);
