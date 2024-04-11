import { Pill } from 'components';
import { useTranslation } from 'libs/translations';

interface PrimeTokensLeftProps {
  tokensLeft: number;
}

const PrimeTokensLeft = ({ tokensLeft }: PrimeTokensLeftProps) => {
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
            tokensLeft,
          }}
        />
      </p>
    </Pill>
  );
};

export default PrimeTokensLeft;
