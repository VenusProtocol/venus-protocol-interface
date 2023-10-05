import BigNumber from 'bignumber.js';
import { Icon, Link, Tooltip } from 'components';
import { useTranslation } from 'translation';

import { PRIME_DOC_URL } from 'constants/prime';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

export interface ApyWithPrimeSimulationBoostProps {
  type: 'supply' | 'borrow';
  apyPrimeSimulationBoost: BigNumber;
  readableApy: string;
  readableLtv: string;
}

export const ApyWithPrimeSimulationBoost: React.FC<ApyWithPrimeSimulationBoostProps> = ({
  type,
  apyPrimeSimulationBoost,
  readableApy,
  readableLtv,
}) => {
  const { t, Trans } = useTranslation();

  const readableApyPrimeSimulationBoost = useFormatPercentageToReadableValue({
    value: apyPrimeSimulationBoost,
  });

  return (
    <div>
      <p className="text-sm">
        {readableApy}{' '}
        <span className="text-xs text-grey">{type === 'supply' && <>/ {readableLtv}</>}</span>
      </p>

      <div className="flex items-center justify-end">
        <p className="mr-1 text-xs text-green">
          {t('marketTable.apy.primeSimulationBoost.label', {
            apyPrimeBoost: `${type === 'supply' ? '+' : '-'}${readableApyPrimeSimulationBoost}`,
          })}
        </p>

        <Tooltip
          className="inline-flex"
          title={
            <Trans
              i18nKey="marketTable.apy.primeSimulationBoost.tooltip"
              components={{
                Link: <Link href={PRIME_DOC_URL} onClick={e => e.stopPropagation()} />,
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
