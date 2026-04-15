import BigNumber from 'bignumber.js';

import { LabeledInlineContent } from 'components';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatTokensToReadableValue } from 'utilities';

export interface EstEarningsRowProps {
  token: Token;
  stakedTokens: BigNumber;
  previewStakedTokens?: BigNumber;
  stakingAprPercentage: number;
}

const calcDailyEarning = (staked: BigNumber, aprPercentage: number) =>
  staked.isGreaterThan(0) && aprPercentage > 0
    ? staked.multipliedBy(aprPercentage / 100 / 365)
    : new BigNumber(0);

export const EstEarningsRow: React.FC<EstEarningsRowProps> = ({
  token,
  stakedTokens,
  previewStakedTokens,
  stakingAprPercentage,
}) => {
  const { t } = useTranslation();

  const currentDailyEarning = calcDailyEarning(stakedTokens, stakingAprPercentage);
  const previewDailyEarning = previewStakedTokens
    ? calcDailyEarning(BigNumber.max(previewStakedTokens, 0), stakingAprPercentage)
    : undefined;

  const readableCurrent = formatTokensToReadableValue({
    value: currentDailyEarning,
    token,
  });

  const readablePreview = previewDailyEarning
    ? formatTokensToReadableValue({
        value: previewDailyEarning,
        token,
      })
    : undefined;

  return (
    <LabeledInlineContent label={t('vault.venusModal.estDailyEarning')}>
      <span className="text-b1s text-white">
        {readablePreview ? `${readableCurrent} → ${readablePreview}` : readableCurrent}
      </span>
    </LabeledInlineContent>
  );
};
