import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { Tooltip, type TooltipProps } from 'components';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';
import type { Address } from 'viem';
import { CalculatorLink } from './CalculatorLink';
import { PrimeApy } from './PrimeApy';
import { PrimeIcon } from './PrimeIcon';
import { SimulationText } from './SimulationText';

export interface PrimeBadgeProps extends Omit<TooltipProps, 'content' | 'children'> {
  token: Token;
  type: 'supply' | 'borrow';
  simulationReferenceValues?: PrimeSimulationDistribution['referenceValues'];
  simulatedApyPercentage?: BigNumber;
  vTokenAddress?: Address;
  className?: string;
}

export const PrimeBadge: React.FC<PrimeBadgeProps> = ({
  token,
  simulationReferenceValues,
  simulatedApyPercentage,
  type,
  vTokenAddress,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      className={cn('inline-flex items-center', className)}
      content={
        <>
          <p>
            {simulationReferenceValues && simulatedApyPercentage ? (
              <SimulationText
                token={token}
                referenceValues={simulationReferenceValues}
                type={type}
              />
            ) : (
              t('apy.primeBadge.tooltip.primeMarket')
            )}
          </p>

          <CalculatorLink vTokenAddress={vTokenAddress} />
        </>
      }
      {...otherProps}
    >
      {simulatedApyPercentage ? <PrimeApy apyPercentage={simulatedApyPercentage} /> : <PrimeIcon />}
    </Tooltip>
  );
};
