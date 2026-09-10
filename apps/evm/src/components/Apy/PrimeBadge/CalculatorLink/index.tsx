import { VENUS_PRIME_DOC_URL } from 'constants/production';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { QUERY_PARAM_TOKEN_ADDRESS } from 'pages/PrimeCalculator/Form';
import type { Address } from 'viem';

export interface CalculatorLinkProps {
  // Preselects the market in the calculator, so each row links to its own numbers
  vTokenAddress?: Address;
}

export const CalculatorLink: React.FC<CalculatorLinkProps> = ({ vTokenAddress }) => {
  const { t } = useTranslation();

  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  return isPrimeCalculatorEnabled ? (
    <Link
      to={
        vTokenAddress
          ? `${routes.primeCalculator.path}?${QUERY_PARAM_TOKEN_ADDRESS}=${vTokenAddress}`
          : routes.primeCalculator.path
      }
      onClick={e => e.stopPropagation()}
    >
      {t('apy.primeBadge.tooltip.calculatorLink')}
    </Link>
  ) : (
    <Link href={VENUS_PRIME_DOC_URL} onClick={e => e.stopPropagation()}>
      {t('apy.primeBadge.tooltip.primeDocLink')}
    </Link>
  );
};
