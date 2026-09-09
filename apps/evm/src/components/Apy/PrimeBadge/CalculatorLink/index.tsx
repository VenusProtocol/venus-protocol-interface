import { VENUS_PRIME_DOC_URL } from 'constants/production';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';

export const CalculatorLink: React.FC = () => {
  const { t } = useTranslation();

  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  return isPrimeCalculatorEnabled ? (
    <Link to={routes.primeCalculator.path} onClick={e => e.stopPropagation()}>
      {t('apy.primeBadge.tooltip.calculatorLink')}
    </Link>
  ) : (
    <Link href={VENUS_PRIME_DOC_URL} onClick={e => e.stopPropagation()}>
      {t('apy.primeBadge.tooltip.primeDocLink')}
    </Link>
  );
};
