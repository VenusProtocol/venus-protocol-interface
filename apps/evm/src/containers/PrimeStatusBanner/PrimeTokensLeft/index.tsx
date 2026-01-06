import { Pill } from 'components';
import { useTranslation } from 'libs/translations';

interface PrimeTokensLeftProps {
  count: number;
}

const PrimeTokensLeft = ({ count }: PrimeTokensLeftProps) => {
  const { Trans } = useTranslation();

  return (
    <Pill>
      <p>
        <Trans
          // DO NOT REMOVE COMMENT: needed by i18next to extract translation key
          // t('primeStatusBanner.tokensLeft_one')
          // t('primeStatusBanner.tokensLeft_many')
          i18nKey="primeStatusBanner.tokensLeft"
          components={{
            WhiteText: <span className="text-white" />,
          }}
          values={{
            count,
          }}
        />
      </p>
    </Pill>
  );
};

export default PrimeTokensLeft;
