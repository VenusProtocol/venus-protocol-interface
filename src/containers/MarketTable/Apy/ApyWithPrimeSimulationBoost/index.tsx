import { Icon, Link, Tooltip } from 'components';
import { useTranslation } from 'translation';
import { PrimeSimulationDistribution } from 'types';

import { PRIME_DOC_URL } from 'constants/prime';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';

export interface ApyWithPrimeSimulationBoostProps {
  type: 'supply' | 'borrow';
  primeSimulationDistribution: PrimeSimulationDistribution;
  readableApy: string;
  readableLtv: string;
}

export const ApyWithPrimeSimulationBoost: React.FC<ApyWithPrimeSimulationBoostProps> = ({
  type,
  primeSimulationDistribution,
  readableApy,
  readableLtv,
}) => {
  const { t, Trans } = useTranslation();

  const readablePrimeApy = useFormatPercentageToReadableValue({
    value: primeSimulationDistribution.apyPercentage,
  });

  return (
    <div>
      <p className="text-sm">
        {readableApy}{' '}
        <span className="text-sm text-grey">{type === 'supply' && <>/ {readableLtv}</>}</span>
      </p>

      <div className="whitespace-nowrap">
        <p className="mr-1 inline-block align-middle text-sm text-green">
          {t('marketTable.apy.primeSimulationBoost.label', {
            apyPrimeBoost: `${type === 'supply' ? '+' : '-'}${readablePrimeApy}`,
          })}
        </p>

        <Tooltip
          className="inline-block align-middle"
          title={
            // TODO: update tooltip to indicate data used to calculate simulation
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
