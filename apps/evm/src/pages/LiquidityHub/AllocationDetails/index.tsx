import BigNumber from 'bignumber.js';

import { Card, ProgressBar, type ProgressBarData } from 'components';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub } from 'types';
import { formatPercentageToReadableValue } from 'utilities';
import { YieldGroupList } from './YieldGroupList';
import { YieldGroupName } from './YieldGroupName';

interface Allocation {
  name: string;
  bgClassname: string;
  allocationPercentage: number;
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

  let allocationLeftPercentage = 100;

  const allocations = liquidityHub.yieldGroups.reduce<Allocation[]>((acc, yieldGroup, index) => {
    const allocationPercentage =
      index === liquidityHub.yieldGroups.length - 1
        ? allocationLeftPercentage
        : yieldGroup.allocationCents
            .multipliedBy(100)
            .dividedBy(totalAllocationCents)
            .dp(0)
            .toNumber();

    allocationLeftPercentage -= allocationPercentage;

    const allocation: Allocation = {
      name: yieldGroup.name,
      bgClassname: yieldGroup.bgClassName,
      allocationPercentage,
    };

    return [...acc, allocation];
  }, []);

  const progressBars: ProgressBarData[] = allocations
    .map((allocation, index) => {
      const lastAllocationPosition = allocations
        .slice(0, index)
        .reduce((acc, allocation) => acc + allocation.allocationPercentage, 0);

      return {
        value: lastAllocationPosition + allocation.allocationPercentage,
        className: allocation.bgClassname,
      };
    })
    .reverse();

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
                <div key={allocation.name} className="flex items-center justify-between space-x-6">
                  <YieldGroupName name={allocation.name} bgClassName={allocation.bgClassname} />

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
