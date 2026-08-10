import BigNumber from 'bignumber.js';

import { Card, ProgressBar, type ProgressBarData } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub } from 'types';
import { clampToZero, compareBigNumbers, formatPercentageToReadableValue } from 'utilities';
import { YieldGroupList } from './YieldGroupList';
import { YieldGroupName } from './YieldGroupName';

interface Allocation {
  nameTranslationKey: string;
  bgClassname: string;
  allocationPercentage: BigNumber;
}

export interface AllocationDetailsProps {
  liquidityHub: LiquidityHub;
}

export const AllocationDetails: React.FC<AllocationDetailsProps> = ({ liquidityHub }) => {
  const { t } = useTranslation();

  const totalAllocationCents = liquidityHub.yieldGroups.reduce(
    (acc, yieldGroup) => acc.plus(yieldGroup.allocationCents),
    new BigNumber(0),
  );

  const totalSupplyBalanceCents = liquidityHub.supplyBalanceCents;
  const hasSupplyBalance = totalSupplyBalanceCents.isGreaterThan(0);

  const unallocatedCents = clampToZero({
    value: totalSupplyBalanceCents.minus(totalAllocationCents),
  });

  const allocations = liquidityHub.yieldGroups.map<Allocation>(yieldGroup => {
    let allocationPercentage = new BigNumber(0);

    if (hasSupplyBalance) {
      allocationPercentage = yieldGroup.allocationCents
        .multipliedBy(100)
        .dividedBy(totalSupplyBalanceCents);
    }

    return {
      nameTranslationKey: yieldGroup.nameTranslationKey,
      bgClassname: yieldGroup.bgClassName,
      allocationPercentage,
    };
  });

  let progressBarValuePercentage = new BigNumber(0);

  const progressBars: ProgressBarData[] = allocations
    .map(allocation => {
      progressBarValuePercentage = progressBarValuePercentage.plus(allocation.allocationPercentage);

      return {
        value: progressBarValuePercentage.toNumber(),
        className: allocation.bgClassname,
      };
    })
    .reverse();

  let unallocatedPercentage = new BigNumber(0);

  if (hasSupplyBalance) {
    unallocatedPercentage = unallocatedCents.multipliedBy(100).dividedBy(totalSupplyBalanceCents);
  }

  if (unallocatedPercentage.isGreaterThan(0)) {
    allocations.push({
      nameTranslationKey: 'liquidityHub.allocationDetails.unallocated',
      bgClassname: 'bg-lightGrey',
      allocationPercentage: unallocatedPercentage,
    });
  }

  allocations.sort((a, b) =>
    compareBigNumbers(a.allocationPercentage, b.allocationPercentage, 'desc'),
  );

  return (
    <Card className="space-y-6 px-0 pt-6 pb-2">
      <div className="space-y-6 px-6">
        <h4 className="text-p2s">{t('liquidityHub.allocationDetails.title')}</h4>

        <ProgressBar
          progressBars={progressBars}
          min={0}
          max={100}
          tooltip={
            <div className="space-y-1">
              {allocations.map(allocation => (
                <div
                  key={allocation.nameTranslationKey}
                  className="flex items-center justify-between space-x-6 whitespace-nowrap"
                >
                  <YieldGroupName
                    name={t(allocation.nameTranslationKey)}
                    bgClassName={allocation.bgClassname}
                  />

                  <p>{formatPercentageToReadableValue(allocation.allocationPercentage)}</p>
                </div>
              ))}
            </div>
          }
        />
      </div>

      <YieldGroupList liquidityHub={liquidityHub} />
    </Card>
  );
};
