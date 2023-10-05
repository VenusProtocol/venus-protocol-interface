import BigNumber from 'bignumber.js';
import { Icon, Link, Tooltip } from 'components';
import { useTranslation } from 'translation';

import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

export interface ApyWithHypotheticalPrimeBoostProps {
  type: 'supply' | 'borrow';
  apyHypotheticalPrimeBoost: BigNumber;
  readableApy: string;
  readableLtv: string;
}

export const ApyWithHypotheticalPrimeBoost: React.FC<ApyWithHypotheticalPrimeBoostProps> = ({
  type,
  apyHypotheticalPrimeBoost,
  readableApy,
  readableLtv,
}) => {
  const { t, Trans } = useTranslation();

  const readableApyHypotheticalPrimeBoost = useFormatPercentageToReadableValue({
    value: apyHypotheticalPrimeBoost,
  });

  return (
    <div>
      <p className="text-sm">
        {readableApy}{' '}
        <span className="text-xs text-grey">{type === 'supply' && <>/ {readableLtv}</>}</span>
      </p>

      <div className="flex items-center justify-end">
        <p className="mr-1 text-xs text-green">
          {t('marketTable.apy.hypotheticalPrimeBoost.label', {
            apyPrimeBoost: `${type === 'supply' ? '+' : '-'}${readableApyHypotheticalPrimeBoost}`,
          })}
        </p>

        <Tooltip
          className="inline-flex"
          title={
            <Trans
              i18nKey="marketTable.apy.hypotheticalPrimeBoost.tooltip"
              components={{
                Link: (
                  // TODO: add link to article
                  <Link href="https://google.com" onClick={e => e.stopPropagation()} />
                ),
              }}
            />
          }
        >
          <Icon name="info" />
        </Tooltip>
      </div>
    </div>
  );
};
