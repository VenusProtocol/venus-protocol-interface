import type BigNumber from 'bignumber.js';

import { cn } from '@venusprotocol/ui';
import { Tooltip, type TooltipProps } from 'components';
import { VENUS_PRIME_DOC_URL } from 'constants/production';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import type { PrimeSimulationDistribution, Token } from 'types';
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
            <Link to={routes.primeCalculator.path} onClick={e => e.stopPropagation()}>
              {t('apy.primeBadge.tooltip.calculatorLink')}
            </Link>
          ) : (
            <Link href={VENUS_PRIME_DOC_URL} onClick={e => e.stopPropagation()}>
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
