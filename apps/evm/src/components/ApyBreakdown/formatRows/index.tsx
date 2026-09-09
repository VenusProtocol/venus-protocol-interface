import type BigNumber from 'bignumber.js';
import type { TFunction } from 'i18next';

import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import type { useTranslation } from 'libs/translations';
import type { MerklDistribution } from 'types';
import { formatDistributionApyToReadableValue, formatPercentageToReadableValue } from 'utilities';
import type { ApyBreakdownItem } from '..';
import type { LabeledInlineContentProps } from '../../LabeledInlineContent';
import { ValueUpdate } from '../../ValueUpdate';

export const formatRows = ({
  item,
  t,
  Trans,
}: {
  item: ApyBreakdownItem;
  t: TFunction<'translation', undefined>;
  Trans: ReturnType<typeof useTranslation>['Trans'];
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

  const findSimulatedMerklDistribution = (distribution: MerklDistribution) =>
    item.simulatedTokenDistributions?.find(
      simulated =>
        simulated.type === 'merkl' &&
        simulated.rewardDetails.merklCampaignIdentifier ===
          distribution.rewardDetails.merklCampaignIdentifier,
    );

  const distributionRows = item.tokenDistributions
    .filter(distribution => distribution.type !== 'primeSimulation' && distribution.isActive)
    .reduce<LabeledInlineContentProps[]>((acc, distribution) => {
      const collateralGate =
        distribution.type === 'merkl' ? distribution.collateralGate : undefined;

      // The simulated amounts can make the user qualify, which is what the total already reflects
      const simulatedMerklDistribution =
        distribution.type === 'merkl' ? findSimulatedMerklDistribution(distribution) : undefined;
      const simulatedCollateralGate =
        simulatedMerklDistribution?.type === 'merkl'
          ? simulatedMerklDistribution.collateralGate
          : undefined;

      // A campaign the user has not qualified for is advertised on the badge, not in the breakdown
      if (
        collateralGate &&
        !collateralGate.isUserEligible &&
        !simulatedCollateralGate?.isUserEligible
      ) {
        return acc;
      }

      if (
        distribution.type !== 'prime' &&
        distribution.apyPercentage.isEqualTo(0) &&
        !simulatedCollateralGate?.isUserEligible
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
      } else if (distribution.type === 'merkl' && collateralGate) {
        // Position-dependent, so it moves with the simulated balances the way Prime APY does
        const simulatedDistribution = simulatedMerklDistribution;

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
        tooltip = (
          <Trans
            i18nKey="apyBreakdown.liquidityHubIntrinsicApyTooltip"
            components={{
              AppLink: <Link to={routes.liquidityHubs.path} onClick={e => e.stopPropagation()} />,
            }}
          />
        );
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
