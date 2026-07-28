import type { TFunction } from 'i18next';

import { formatPercentageToReadableValue } from 'utilities';
import type { ApyBreakdownItem } from '..';
import type { LabeledInlineContentProps } from '../../LabeledInlineContent';
import { ValueUpdate } from '../../ValueUpdate';

export const formatRows = ({
  item,
  t,
}: {
  item: ApyBreakdownItem;
  t: TFunction<'translation', undefined>;
}) => {
  const rows: LabeledInlineContentProps[] = [
    {
      label: item.type === 'borrow' ? t('apyBreakdown.borrowApy') : t('apyBreakdown.supplyApy'),
      iconSrc: item.token,
      children: formatPercentageToReadableValue(
        item.simulatedBaseApyPercentage ?? item.baseApyPercentage,
      ),
    },
  ];

  const distributionRows = item.tokenDistributions
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

      let children: React.ReactNode;

      if (distribution.type === 'prime') {
        const simulatedPrimeDistribution = item.simulatedTokenDistributions?.find(
          simulatedDistribution => simulatedDistribution.type === 'prime',
        );

        children = (
          <ValueUpdate
            original={formatPercentageToReadableValue(distribution.apyPercentage)}
            update={
              simulatedPrimeDistribution &&
              formatPercentageToReadableValue(simulatedPrimeDistribution.apyPercentage)
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
