import type BigNumber from 'bignumber.js';
import type { TFunction } from 'i18next';

import { formatDistributionApyToReadableValue, formatPercentageToReadableValue } from 'utilities';
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
  const formatDistributionApy = (apyPercentage: BigNumber) =>
    formatDistributionApyToReadableValue({ apyPercentage, type: item.type });

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
      const collateralGate =
        distribution.type === 'merkl' ? distribution.collateralGate : undefined;
      const isMissingRequiredCollateral = !!collateralGate && !collateralGate.isUserEligible;

      if (
        distribution.type !== 'prime' &&
        distribution.apyPercentage.isEqualTo(0) &&
        !isMissingRequiredCollateral
      ) {
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

      if (distribution.type === 'liquidity-hub-intrinsic') {
        label = t('apyBreakdown.liquidityHubIntrinsicApy');
      }

      let children: React.ReactNode;

      if (distribution.type === 'prime') {
        const simulatedPrimeDistribution = item.simulatedTokenDistributions?.find(
          simulatedDistribution => simulatedDistribution.type === 'prime',
        );

        children = (
          <ValueUpdate
            original={formatDistributionApy(distribution.apyPercentage)}
            update={
              simulatedPrimeDistribution &&
              formatDistributionApy(simulatedPrimeDistribution.apyPercentage)
            }
          />
        );
      } else if (isMissingRequiredCollateral) {
        // Muted, as this rate is not part of the total until the user provides the collateral
        children = (
          <span className="text-grey">
            {formatDistributionApy(collateralGate.maxApyPercentage)}
          </span>
        );
      } else if (distribution.type === 'merkl' && collateralGate) {
        // Position-dependent, so it moves with the simulated balances the way Prime APY does
        const simulatedDistribution = item.simulatedTokenDistributions?.find(
          simulated =>
            simulated.type === 'merkl' &&
            simulated.rewardDetails.merklCampaignIdentifier ===
              distribution.rewardDetails.merklCampaignIdentifier,
        );

        const hasMoved =
          !!simulatedDistribution &&
          !simulatedDistribution.apyPercentage.isEqualTo(distribution.apyPercentage);

        children = (
          <ValueUpdate
            original={formatDistributionApy(distribution.apyPercentage)}
            update={
              hasMoved ? formatDistributionApy(simulatedDistribution.apyPercentage) : undefined
            }
          />
        );
      } else {
        children = formatDistributionApy(distribution.apyPercentage);
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

      if (distribution.type === 'liquidity-hub-intrinsic') {
        tooltip = t('apyBreakdown.liquidityHubIntrinsicApyTooltip');
      }

      if (isMissingRequiredCollateral) {
        tooltip = t('apyBreakdown.collateralGatedMerklApyTooltip', {
          tokenSymbol: item.token.symbol,
        });
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
