import { LayeredValues } from 'components';
import { useMemo } from 'react';
import { Asset } from 'types';
import { getCombinedDistributionApys } from 'utilities';

import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

import { ColumnKey } from '../types';
import { ApyWithPrimeBoost } from './ApyWithPrimeBoost';
import { ApyWithPrimeSimulationBoost } from './ApyWithPrimeSimulationBoost';

export interface ApyProps {
  asset: Asset;
  column: ColumnKey;
}

export const Apy: React.FC<ApyProps> = ({ asset, column }) => {
  const type = column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv' ? 'supply' : 'borrow';

  const combinedDistributionApys = useMemo(() => getCombinedDistributionApys({ asset }), [asset]);

  const readableApy = useFormatPercentageToReadableValue({
    value:
      type === 'supply'
        ? asset.supplyApyPercentage.plus(combinedDistributionApys.totalSupplyApyPercentage)
        : asset.borrowApyPercentage.minus(combinedDistributionApys.totalBorrowApyPercentage),
  });

  const readableLtv = useFormatPercentageToReadableValue({
    value: +asset.collateralFactor * 100,
  });

  const apyPrimeBoost =
    type === 'supply'
      ? combinedDistributionApys.supplyApyPrimePercentage
      : combinedDistributionApys.borrowApyPrimePercentage;

  // Display Prime boost
  if (apyPrimeBoost) {
    return (
      <ApyWithPrimeBoost
        type={type}
        supplyApyPercentage={asset.supplyApyPercentage}
        borrowApyPercentage={asset.borrowApyPercentage}
        distributionsSupplyApyRewardsPercentage={
          combinedDistributionApys.supplyApyRewardsPercentage
        }
        distributionsBorrowApyRewardsPercentage={
          combinedDistributionApys.borrowApyRewardsPercentage
        }
        readableApy={readableApy}
        readableLtv={readableLtv}
      />
    );
  }

  const apyPrimeSimulationBoost =
    type === 'supply'
      ? combinedDistributionApys.supplyApyPrimeSimulationPercentage
      : combinedDistributionApys.borrowApyPrimeSimulationPercentage;

  // Display hypothetical Prime boost
  if (apyPrimeSimulationBoost) {
    return (
      <ApyWithPrimeSimulationBoost
        type={type}
        apyPrimeSimulationBoost={apyPrimeSimulationBoost}
        readableApy={readableApy}
        readableLtv={readableLtv}
      />
    );
  }

  // No Prime boost or hypothetical Prime boost to display

  // Display supply APY
  if (type === 'supply') {
    return <LayeredValues topValue={readableApy} bottomValue={readableLtv} />;
  }

  // Display borrow APY
  return readableApy;
};
