import { useTranslation } from 'packages/translations';

interface PrimeTokensLeftProps {
  tokensLeft: number;
}

const PrimeTokensLeft = ({ tokensLeft }: PrimeTokensLeftProps) => {
  const { Trans } = useTranslation();
  return (
    <div className="flex flex-row rounded-full border border-yellow bg-[#2E2C2A] px-3 py-1 text-xs font-semibold uppercase lining-nums proportional-nums leading-[15px] tracking-[0.5px] text-yellow [font-variant:all-small-caps]">
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
    </div>
  );
};

export default PrimeTokensLeft;
