import type BigNumber from 'bignumber.js';

import { Tooltip, type TooltipProps } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePrimeCalculatorPagePath } from 'hooks/usePrimeCalculatorPagePath';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';
import { cn } from 'utilities';
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

  const primeCalculatorPagePath = usePrimeCalculatorPagePath({ tokenAddress: token.address });
  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

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

          {isPrimeCalculatorEnabled ? (
            <Link to={primeCalculatorPagePath} onClick={e => e.stopPropagation()}>
              {t('apy.primeBadge.tooltip.calculatorLink')}
            </Link>
          ) : (
            <Link href={PRIME_DOC_URL} onClick={e => e.stopPropagation()}>
              {t('apy.primeBadge.tooltip.primeDocLink')}
            </Link>
          )}
        </>
      }
      {...otherProps}
    >
      {simulatedApyPercentage ? <PrimeApy apyPercentage={simulatedApyPercentage} /> : <PrimeIcon />}
    </Tooltip>
  );
};
