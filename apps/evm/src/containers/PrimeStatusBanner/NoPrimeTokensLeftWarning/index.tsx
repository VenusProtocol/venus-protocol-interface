import { useTranslation } from 'libs/translations';

import { Icon, Tooltip } from 'components';

interface PrimeTokensLeftProps {
  primeTokenLimit: number;
}

const NoPrimeTokensLeftWarning = ({ primeTokenLimit }: PrimeTokensLeftProps) => {
  const { t } = useTranslation();
  return (
    <>
      <p className="mr-2 text-sm text-orange">{t('primeStatusBanner.noPrimeTokenWarning.text')}</p>

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
