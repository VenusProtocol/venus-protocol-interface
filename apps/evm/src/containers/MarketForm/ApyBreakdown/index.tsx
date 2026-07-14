import BigNumber from 'bignumber.js';

import {
  Accordion,
  InfoIcon,
  LabeledInlineContent,
  type LabeledInlineContentProps,
} from 'components';
import { useTranslation } from 'libs/translations';
import type { BalanceMutation, Pool } from 'types';
import {
  areAddressesEqual,
  formatPercentageToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';
import { formatRows } from './formatRows';

export interface ApyBreakdownProps {
  pool: Pool;
  simulatedPool?: Pool;
  balanceMutations?: BalanceMutation[];
  renderType?: 'block' | 'accordion';
}

export const ApyBreakdown: React.FC<ApyBreakdownProps> = ({
  pool,
  simulatedPool,
  balanceMutations = [],
  renderType = 'block',
}) => {
  const { t } = useTranslation();
  const shouldShowNetApy = balanceMutations.length > 1;

  const { rows, totalApyPercentage } = balanceMutations.reduce<{
    rows: LabeledInlineContentProps[];
    totalApyPercentage: BigNumber;
  }>(
    (acc, balanceMutation) => {
      // Skip VAI mutations
      if (balanceMutation.type === 'vai') {
        return acc;
      }

      const asset = pool.assets.find(a =>
        areAddressesEqual(a.vToken.address, balanceMutation.vTokenAddress),
      );

      if (!asset) {
        return acc;
      }

      const simulatedAsset = simulatedPool?.assets.find(a =>
        areAddressesEqual(a.vToken.address, balanceMutation.vTokenAddress),
      );

      const tempRows = formatRows({
        asset,
        simulatedAsset,
        balanceMutation,
        t,
      });

      const apys = getCombinedDistributionApys({
        asset: simulatedAsset ?? asset,
      });

      let tmpTotalApyPercentage = acc.totalApyPercentage;

      if (balanceMutation.action === 'supply' || balanceMutation.action === 'withdraw') {
        tmpTotalApyPercentage = tmpTotalApyPercentage.plus(apys.totalSupplyApyPercentage);
      } else {
        tmpTotalApyPercentage = shouldShowNetApy
          ? tmpTotalApyPercentage.minus(apys.totalBorrowApyPercentage)
          : tmpTotalApyPercentage.plus(apys.totalBorrowApyPercentage);
      }

      return {
        rows: acc.rows.concat(tempRows),
        totalApyPercentage: tmpTotalApyPercentage,
      };
    },
    {
      rows: [],
      totalApyPercentage: new BigNumber(0),
    },
  );

  const readableTotalApy = formatPercentageToReadableValue(totalApyPercentage);

  let label: undefined | string;
  let tooltip: undefined | string;

  if (shouldShowNetApy) {
    label = t('apyBreakdown.netApy.label');
    tooltip = t('apyBreakdown.netApy.tooltip');
  } else {
    const balanceMutationAction = balanceMutations[0]?.action;

    label =
      balanceMutationAction === 'supply' || balanceMutationAction === 'withdraw'
        ? t('apyBreakdown.totalApy.supplyApyLabel')
        : t('apyBreakdown.totalApy.borrowApyLabel');

    tooltip =
      balanceMutationAction === 'supply' || balanceMutationAction === 'withdraw'
        ? t('apyBreakdown.totalApy.supplyApyTooltip')
        : t('apyBreakdown.totalApy.borrowApyTooltip');
  }

  const rowsDom = rows.map((row, i) => <LabeledInlineContent {...row} key={`${row.label}-${i}`} />);

  if (renderType === 'block') {
    return (
      <div className="space-y-2">
        {rowsDom}

        <LabeledInlineContent tooltip={tooltip} label={label}>
          {readableTotalApy}
        </LabeledInlineContent>
      </div>
    );
  }

  return (
    <Accordion
      title={
        <div className="flex items-center gap-x-2">
          <p className="text-sm">{label}</p>

          <InfoIcon className="inline-flex items-center" tooltip={tooltip} />
        </div>
      }
      rightLabel={readableTotalApy}
    >
      <div className="space-y-2">{rowsDom}</div>
    </Accordion>
  );
};
