import { InfoIcon } from 'components/InfoIcon';
import { useTranslation } from 'libs/translations';

interface PrimeTokensLeftProps {
  primeTokenLimit: number;
}

const NoPrimeTokensLeftWarning = ({ primeTokenLimit }: PrimeTokensLeftProps) => {
  const { t } = useTranslation();
  return (
    <>
      <p className="text-orange mr-2 text-sm">{t('primeStatusBanner.noPrimeTokenWarning.text')}</p>

      <InfoIcon
        tooltip={t('primeStatusBanner.noPrimeTokenWarning.tooltip', { primeTokenLimit })}
        className="inline-flex"
        iconClassName="text-orange"
      />
    </>
  );
};

export default NoPrimeTokensLeftWarning;
