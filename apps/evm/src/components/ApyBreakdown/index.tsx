import BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import type { Token, TokenDistribution } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { Accordion } from '../Accordion';
import { InfoIcon } from '../InfoIcon';
import { LabeledInlineContent, type LabeledInlineContentProps } from '../LabeledInlineContent';
import { formatRows } from './formatRows';

export interface ApyBreakdownItem {
  type: 'supply' | 'borrow';
  token: Token;
  baseApyPercentage: BigNumber;
  tokenDistributions: TokenDistribution[];
  simulatedBaseApyPercentage?: BigNumber;
  simulatedTokenDistributions?: TokenDistribution[];
}

export interface ApyBreakdownProps {
  items?: ApyBreakdownItem[];
  renderType?: 'block' | 'accordion';
}

export const ApyBreakdown: React.FC<ApyBreakdownProps> = ({ items = [], renderType = 'block' }) => {
  const { t } = useTranslation();
  const shouldShowNetApy = items.length > 1;

  const { rows, totalApyPercentage } = items.reduce<{
    rows: LabeledInlineContentProps[];
    totalApyPercentage: BigNumber;
  }>(
    (acc, item) => {
      const baseApyPercentage = item.simulatedBaseApyPercentage ?? item.baseApyPercentage;
      const tokenDistributions = item.simulatedTokenDistributions ?? item.tokenDistributions;

      const distributionApyPercentage = tokenDistributions.reduce((total, distribution) => {
        if (!distribution.isActive || distribution.type === 'primeSimulation') {
          return total;
        }

        return total.plus(distribution.apyPercentage);
      }, new BigNumber(0));

      const itemTotalApyPercentage =
        item.type === 'supply'
          ? baseApyPercentage.plus(distributionApyPercentage)
          : baseApyPercentage.minus(distributionApyPercentage);

      const totalApyPercentage =
        shouldShowNetApy && item.type === 'borrow'
          ? acc.totalApyPercentage.minus(itemTotalApyPercentage)
          : acc.totalApyPercentage.plus(itemTotalApyPercentage);

      return {
        rows: acc.rows.concat(formatRows({ item, t })),
        totalApyPercentage,
      };
    },
    {
      rows: [],
      totalApyPercentage: new BigNumber(0),
    },
  );

  const readableTotalApy = formatPercentageToReadableValue(totalApyPercentage);

  let label: string;
  let tooltip: string;

  if (shouldShowNetApy) {
    label = t('apyBreakdown.netApy.label');
    tooltip = t('apyBreakdown.netApy.tooltip');
  } else if (items[0]?.type === 'supply') {
    label = t('apyBreakdown.totalApy.supplyApyLabel');
    tooltip = t('apyBreakdown.totalApy.supplyApyTooltip');
  } else {
    label = t('apyBreakdown.totalApy.borrowApyLabel');
    tooltip = t('apyBreakdown.totalApy.borrowApyTooltip');
  }

  const rowsDom = rows.map((row, index) => (
    <LabeledInlineContent {...row} key={`${row.label}-${index}`} />
  ));

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
          <p className="text-b1r">{label}</p>

          <InfoIcon className="inline-flex items-center" tooltip={tooltip} />
        </div>
      }
      rightLabel={readableTotalApy}
    >
      <div className="space-y-2">{rowsDom}</div>
    </Accordion>
  );
};
