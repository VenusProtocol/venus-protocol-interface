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
          i18nKey="primeStatusBanner.tokensLeft"
          components={{
            WhiteText: <span className="text-offWhite" />,
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
