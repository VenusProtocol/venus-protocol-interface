/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types';
import { formatPercentageToReadableValue, getCombinedDistributionApys } from 'utilities';

import { LabeledInlineContentProps } from 'components/LabeledInlineContent';

export interface UseAssetInfoInput {
  asset?: Asset;
  type: 'supply' | 'borrow';
}

const useAssetInfo = ({ asset, type }: UseAssetInfoInput) => {
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
      .map(distribution => ({
        label:
          distribution.type === 'prime'
            ? t('assetInfo.primeApy', { tokenSymbol: distribution.token.symbol })
            : t('assetInfo.distributionApy', { tokenSymbol: distribution.token.symbol }),
        iconSrc: distribution.token,
        children: formatPercentageToReadableValue(distribution.apyPercentage),
      }));

    const combinedDistributionApys = getCombinedDistributionApys({
      asset,
    });

    rows.push(...distributionRows, {
      label: t('assetInfo.totalApy.label'),
      tooltip:
        type === 'borrow'
          ? t('assetInfo.totalApy.borrowApyTooltip')
          : t('assetInfo.totalApy.supplyApyTooltip'),
      children: formatPercentageToReadableValue(
        type === 'borrow'
          ? asset.borrowApyPercentage.minus(combinedDistributionApys.totalBorrowApyPercentage)
          : asset.supplyApyPercentage.plus(combinedDistributionApys.totalSupplyApyPercentage),
      ),
    });

    return rows;
  }, [asset, t]);
};

export default useAssetInfo;
