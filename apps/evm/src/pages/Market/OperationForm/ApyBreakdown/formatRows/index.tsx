import type { TFunction } from 'i18next';

import { type LabeledInlineContentProps, ValueUpdate } from 'components';
import type { Asset, BalanceMutation } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export const formatRows = ({
  balanceMutation,
  asset,
  simulatedAsset,
  t,
}: {
  balanceMutation: BalanceMutation;
  asset: Asset;
  t: TFunction<'translation', undefined>;
  simulatedAsset?: Asset;
}) => {
  const refAsset = simulatedAsset ?? asset;

  const isMutatingBorrowBalance =
    balanceMutation.action === 'borrow' || balanceMutation.action === 'repay';

  const rows: LabeledInlineContentProps[] = [
    {
      label: isMutatingBorrowBalance ? t('apyBreakdown.borrowApy') : t('apyBreakdown.supplyApy'),
      iconSrc: refAsset.vToken.underlyingToken,
      children: formatPercentageToReadableValue(
        isMutatingBorrowBalance ? refAsset.borrowApyPercentage : refAsset.supplyApyPercentage,
      ),
    },
  ];

  const distributionRows = (
    isMutatingBorrowBalance ? asset.borrowTokenDistributions : asset.supplyTokenDistributions
  )
    .filter(distribution => distribution.type !== 'primeSimulation' && distribution.isActive)
    .reduce<LabeledInlineContentProps[]>((acc, distribution) => {
      if (distribution.type !== 'prime' && distribution.apyPercentage.isEqualTo(0)) {
        return acc;
      }

      let label = t('apyBreakdown.distributionApy');

      if (distribution.type === 'prime') {
        label = t('apyBreakdown.primeApy');
      }

      if (distribution.type === 'merkl') {
        label = t('apyBreakdown.externalDistributionApy', {
          description: distribution.rewardDetails.description,
          tokenSymbol: distribution.token.symbol,
        });
      }

      if (distribution.type === 'intrinsic') {
        label = t('apyBreakdown.intrinsicApy');
      }

      if (distribution.type === 'off-chain') {
        label = t('apyBreakdown.offChainApy');
      }

      if (distribution.type === 'yield-to-maturity') {
        label = t('apyBreakdown.yieldToMaturityApy');
      }

      let children: undefined | React.ReactNode;

      if (distribution.type === 'prime') {
        const simulatedPrimeDistribution = (
          isMutatingBorrowBalance
            ? simulatedAsset?.borrowTokenDistributions
            : simulatedAsset?.supplyTokenDistributions
        )?.find(d => d.type === 'prime');

        children = (
          <ValueUpdate
            original={formatPercentageToReadableValue(distribution.apyPercentage)}
            update={
              simulatedPrimeDistribution?.apyPercentage &&
              formatPercentageToReadableValue(simulatedPrimeDistribution?.apyPercentage)
            }
          />
        );
      } else {
        children = formatPercentageToReadableValue(distribution.apyPercentage);
      }

      let tooltip = undefined;

      if (distribution.type === 'venus') {
        tooltip = t('apyBreakdown.distributionTooltip');
      }

      if (distribution.type === 'intrinsic') {
        tooltip = t('apyBreakdown.intrinsicApyTooltip');
      }

      if (distribution.type === 'off-chain') {
        tooltip = t('apyBreakdown.offChainApyTooltip');
      }

      if (distribution.type === 'yield-to-maturity') {
        tooltip = t('apyBreakdown.yieldToMaturityApyTooltip');
      }

      const row: LabeledInlineContentProps = {
        label,
        iconSrc: distribution.token,
        tooltip,
        children,
      };

      return [...acc, row];
    }, []);

  return rows.concat(distributionRows);
};
