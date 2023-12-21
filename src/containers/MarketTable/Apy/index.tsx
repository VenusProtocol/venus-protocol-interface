import { useMemo } from 'react';

import { LayeredValues } from 'components';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import { useGetToken } from 'packages/tokens';
import { Asset, PrimeDistribution, PrimeSimulationDistribution } from 'types';
import { getCombinedDistributionApys } from 'utilities';

import { ColumnKey } from '../types';
import { ApyWithPrimeBoost } from './ApyWithPrimeBoost';
import { ApyWithPrimeSimulationBoost } from './ApyWithPrimeSimulationBoost';

export interface ApyProps {
  asset: Asset;
  column: ColumnKey;
}

export const Apy: React.FC<ApyProps> = ({ asset, column }) => {
  const type = column === 'supplyApyLtv' || column === 'labeledSupplyApyLtv' ? 'supply' : 'borrow';

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const combinedDistributionApys = useMemo(() => getCombinedDistributionApys({ asset }), [asset]);

  const { primeDistribution, primeSimulationDistribution } = useMemo(() => {
    const result: {
      primeSimulationDistribution?: PrimeSimulationDistribution;
      primeDistribution?: PrimeDistribution;
    } = {};

    const distributions = type === 'borrow' ? asset.borrowDistributions : asset.supplyDistributions;

    distributions.forEach(distribution => {
      if (distribution.type === 'prime') {
        result.primeDistribution = distribution;
      } else if (distribution.type === 'primeSimulation') {
        result.primeSimulationDistribution = distribution;
      }
    });

    return result;
  }, [asset.borrowDistributions, asset.supplyDistributions, type]);

  const apyPercentage =
    type === 'borrow'
      ? asset.borrowApyPercentage.minus(combinedDistributionApys.totalBorrowApyPercentage)
      : asset.supplyApyPercentage.plus(combinedDistributionApys.totalSupplyApyPercentage);

  const readableApy = useFormatPercentageToReadableValue({
    value: apyPercentage,
  });

  const readableLtv = useFormatPercentageToReadableValue({
    value: +asset.collateralFactor * 100,
  });

  // Display Prime boost
  if (primeDistribution && primeDistribution.apyPercentage.isGreaterThan(0)) {
    const apyPercentageWithoutPrimeBoost =
      type === 'borrow'
        ? apyPercentage.plus(primeDistribution.apyPercentage)
        : apyPercentage.minus(primeDistribution.apyPercentage);

    return (
      <ApyWithPrimeBoost
        type={type}
        tokenAddress={asset.vToken.underlyingToken.address}
        apyPercentage={apyPercentage}
        apyPercentageWithoutPrimeBoost={apyPercentageWithoutPrimeBoost}
        readableLtv={readableLtv}
      />
    );
  }

  // Display hypothetical Prime boost
  if (primeSimulationDistribution && primeSimulationDistribution.apyPercentage.isGreaterThan(0)) {
    return (
      <ApyWithPrimeSimulationBoost
        type={type}
        tokenAddress={asset.vToken.underlyingToken.address}
        readableApy={readableApy}
        readableLtv={readableLtv}
        primeSimulationDistribution={primeSimulationDistribution}
        xvs={xvs!}
      />
    );
  }

  // No Prime boost or Prime boost simulation to display

  // Display supply APY
  if (type === 'supply') {
    return <LayeredValues topValue={readableApy} bottomValue={readableLtv} />;
  }

  // Display borrow APY
  return readableApy;
};
