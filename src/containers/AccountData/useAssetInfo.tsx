/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types';
import { formatPercentageToReadableValue, getCombinedDistributionApys } from 'utilities';

import { LabeledInlineContentProps } from 'components/LabeledInlineContent';
import { ValueUpdate } from 'components/ValueUpdate';

export interface UseAssetInfoInput {
  type: 'supply' | 'borrow';
  hypotheticalAssetBorrowPrimeApyPercentage?: BigNumber;
  hypotheticalAssetSupplyPrimeApyPercentage?: BigNumber;
  asset?: Asset;
}

const useAssetInfo = ({
  asset,
  type,
  hypotheticalAssetBorrowPrimeApyPercentage,
  hypotheticalAssetSupplyPrimeApyPercentage,
}: UseAssetInfoInput) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const rows: LabeledInlineContentProps[] = [];

    if (!asset) {
      return rows;
    }

    rows.push({
      label: type === 'borrow' ? t('assetInfo.borrowApy') : t('assetInfo.supplyApy'),
      iconSrc: asset.vToken.underlyingToken,
      children: formatPercentageToReadableValue(
        type === 'borrow' ? asset.borrowApyPercentage : asset.supplyApyPercentage,
      ),
    });

    const distributionRows = (
      type === 'borrow' ? asset.borrowDistributions : asset.supplyDistributions
    )
      .filter(distribution => distribution.type !== 'primeSimulation')
      .map(distribution => {
        const children =
          distribution.type === 'prime' ? (
            <ValueUpdate
              original={distribution.apyPercentage}
              update={
                type === 'borrow'
                  ? hypotheticalAssetBorrowPrimeApyPercentage
                  : hypotheticalAssetSupplyPrimeApyPercentage
              }
              format={formatPercentageToReadableValue}
            />
          ) : (
            formatPercentageToReadableValue(distribution.apyPercentage)
          );

        return {
          label:
            distribution.type === 'prime'
              ? t('assetInfo.primeApy', { tokenSymbol: distribution.token.symbol })
              : t('assetInfo.distributionApy', { tokenSymbol: distribution.token.symbol }),
          iconSrc: distribution.token,
          children,
        };
      });

    const combinedDistributionApys = getCombinedDistributionApys({
      asset,
    });

    let hypotheticalTotalDistributionBorrowApyPercentage =
      combinedDistributionApys.totalBorrowApyPercentage;
    if (hypotheticalAssetBorrowPrimeApyPercentage) {
      hypotheticalTotalDistributionBorrowApyPercentage =
        hypotheticalTotalDistributionBorrowApyPercentage
          .minus(combinedDistributionApys.borrowApyPrimePercentage || 0)
          .plus(hypotheticalAssetBorrowPrimeApyPercentage);
    }

    let hypotheticalTotalDistributionSupplyApyPercentage =
      combinedDistributionApys.totalSupplyApyPercentage;
    if (hypotheticalAssetSupplyPrimeApyPercentage) {
      hypotheticalTotalDistributionSupplyApyPercentage =
        hypotheticalTotalDistributionSupplyApyPercentage
          .minus(combinedDistributionApys.supplyApyPrimePercentage || 0)
          .plus(hypotheticalAssetSupplyPrimeApyPercentage);
    }

    rows.push(...distributionRows, {
      label: t('assetInfo.totalApy.label'),
      tooltip:
        type === 'borrow'
          ? t('assetInfo.totalApy.borrowApyTooltip')
          : t('assetInfo.totalApy.supplyApyTooltip'),
      children: formatPercentageToReadableValue(
        type === 'borrow'
          ? asset.borrowApyPercentage.minus(hypotheticalTotalDistributionBorrowApyPercentage)
          : asset.supplyApyPercentage.plus(hypotheticalTotalDistributionSupplyApyPercentage),
      ),
    });

    return rows;
  }, [
    asset,
    t,
    hypotheticalAssetBorrowPrimeApyPercentage,
    hypotheticalAssetSupplyPrimeApyPercentage,
  ]);
};

export default useAssetInfo;
