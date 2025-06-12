import type { Asset, ImportableSupplyPosition } from 'types';
import { convertMantissaToTokens, getCombinedDistributionApys } from 'utilities';
import type { Address } from 'viem';
import type { PositionProps } from '../../ImportablePositions/Position';

export type AssetMapping = {
  [tokenAddress: Address]: Asset;
};

export const filterProfitableImports = ({
  importablePositions,
  highestSupplyApyAssetMapping,
}: {
  importablePositions: ImportableSupplyPosition[];
  highestSupplyApyAssetMapping: AssetMapping;
}) =>
  importablePositions.reduce<PositionProps[]>((acc, position) => {
    const tokenAddress = position.tokenAddress.toLowerCase() as Address;

    if (!Object.prototype.hasOwnProperty.call(highestSupplyApyAssetMapping, tokenAddress)) {
      return acc;
    }

    const asset = highestSupplyApyAssetMapping[tokenAddress];
    const combinedDistributionApys = getCombinedDistributionApys({ asset });

    const supplyApyPercentage = asset.supplyApyPercentage.plus(
      combinedDistributionApys.totalSupplyApyBoostPercentage,
    );

    if (supplyApyPercentage.isLessThan(position.supplyApyPercentage)) {
      return acc;
    }

    const userSupplyBalanceTokens = convertMantissaToTokens({
      value: position.userSupplyBalanceMantissa,
      token: asset.vToken.underlyingToken,
    });

    const positionProps: PositionProps = {
      userSupplyBalanceTokens,
      token: asset.vToken.underlyingToken,
      currentSupplyApyPercentage: position.supplyApyPercentage,
      asset,
      supplyPosition: position,
    };

    return [...acc, positionProps];
  }, []);
