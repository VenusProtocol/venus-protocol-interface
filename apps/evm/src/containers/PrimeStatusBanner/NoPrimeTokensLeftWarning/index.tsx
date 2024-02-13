import { Icon, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';

interface PrimeTokensLeftProps {
  primeTokenLimit: number;
}

const NoPrimeTokensLeftWarning = ({ primeTokenLimit }: PrimeTokensLeftProps) => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-orange mr-2 text-sm">{t('primeStatusBanner.noPrimeTokenWarning.text')}</p>

      <Tooltip
        title={t('primeStatusBanner.noPrimeTokenWarning.tooltip', { primeTokenLimit })}
        className="inline-flex"
      >
        <Icon name="info" className="text-orange" />
      </Tooltip>
    </>
  );
};

export default NoPrimeTokensLeftWarning;
