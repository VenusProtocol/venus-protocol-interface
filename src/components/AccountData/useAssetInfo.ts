/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Asset } from 'types';
import {
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';

import { LabeledInlineContentProps } from 'components/LabeledInlineContent';

export interface UseAssetInfoInput {
  asset?: Asset;
  isAssetIsolated: boolean;
  type: 'supply' | 'borrow';
}

const useAssetInfo = ({ asset, isAssetIsolated, type }: UseAssetInfoInput) => {
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

    if (!isAssetIsolated) {
      const distributionRows = asset.distributions.map(distribution => ({
        label: t('assetInfo.distributionApy', { tokenSymbol: distribution.token.symbol }),
        iconSrc: distribution.token,
        children: formatPercentageToReadableValue(
          type === 'borrow' ? distribution.borrowApyPercentage : distribution.supplyApyPercentage,
        ),
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
            ? asset.borrowApyPercentage.minus(combinedDistributionApys.borrowApyPercentage)
            : asset.supplyApyPercentage.plus(combinedDistributionApys.supplyApyPercentage),
        ),
      });
    } else {
      // HOTFIX: we don't display the distribution APYs for isolated pools, instead we display the
      // tokens distributed daily until we get a solution to calculate accurate distribution APYs
      const distributionRows = asset.distributions.map(distribution => ({
        label: t('assetInfo.dailyDistributedTokens', { tokenSymbol: distribution.token.symbol }),
        iconSrc: distribution.token,
        children: formatTokensToReadableValue({
          value:
            type === 'supply'
              ? distribution.supplyDailyDistributedTokens
              : distribution.borrowDailyDistributedTokens,
          token: distribution.token,
          addSymbol: false,
        }),
        tooltip:
          type === 'supply'
            ? t('assetInfo.dailyDistributedTokensSupplyTooltip', {
                tokenSymbol: distribution.token.symbol,
              })
            : t('assetInfo.dailyDistributedTokensBorrowTooltip', {
                tokenSymbol: distribution.token.symbol,
              }),
      }));

      rows.push(...distributionRows);
    }

    return rows;
  }, [asset, t]);
};

export default useAssetInfo;
