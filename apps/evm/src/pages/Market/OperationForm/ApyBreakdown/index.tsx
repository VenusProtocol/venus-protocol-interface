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

      return {
        rows: acc.rows.concat(tempRows),
        totalApyPercentage:
          balanceMutation.action === 'supply' || balanceMutation.action === 'withdraw'
            ? acc.totalApyPercentage.plus(apys.totalSupplyApyPercentage)
            : acc.totalApyPercentage.minus(apys.totalBorrowApyPercentage),
      };
    },
    {
      rows: [],
      totalApyPercentage: new BigNumber(0),
    },
  );

  const readableTotalApy = formatPercentageToReadableValue(totalApyPercentage);

  let label = t('apyBreakdown.totalApy.label');
  let tooltip: undefined | string;

  if (balanceMutations.length > 1) {
    label = t('apyBreakdown.netApy.label');
  } else {
    const balanceMutationAction = balanceMutations[0]?.action;

    tooltip =
      balanceMutationAction === 'borrow' || balanceMutationAction === 'repay'
        ? t('apyBreakdown.totalApy.borrowApyTooltip')
        : t('apyBreakdown.totalApy.supplyApyTooltip');
  }

  const rowsDom = rows.map(row => <LabeledInlineContent {...row} key={row.label} />);

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
          <p className="text-sm md:text-base">{label}</p>

          <InfoIcon className="inline-flex items-center" tooltip={tooltip} />
        </div>
      }
      rightLabel={readableTotalApy}
    >
      <div className="space-y-2">{rowsDom}</div>
    </Accordion>
  );
};
