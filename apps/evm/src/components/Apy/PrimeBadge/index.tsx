import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { Tooltip, type TooltipProps } from 'components';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';
import { CalculatorLink } from './CalculatorLink';
import { PrimeApy } from './PrimeApy';
import { PrimeIcon } from './PrimeIcon';
import { SimulationText } from './SimulationText';

export interface PrimeBadgeProps extends Omit<TooltipProps, 'content' | 'children'> {
  token: Token;
  type: 'supply' | 'borrow';
  simulationReferenceValues?: PrimeSimulationDistribution['referenceValues'];
  simulatedApyPercentage?: BigNumber;
  className?: string;
}

export const PrimeBadge: React.FC<PrimeBadgeProps> = ({
  token,
  simulationReferenceValues,
  simulatedApyPercentage,
  type,
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

          <CalculatorLink />
        </>
      }
      {...otherProps}
    >
      {simulatedApyPercentage ? <PrimeApy apyPercentage={simulatedApyPercentage} /> : <PrimeIcon />}
    </Tooltip>
  );
};
