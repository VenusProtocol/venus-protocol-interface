import BigNumber from 'bignumber.js';
import { ProgressCircle, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { theme } from 'theme';
import type { Token } from 'types';

import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

const THRESHOLD_GRADIENT_ID = 'cap-threshold-gradient';

export interface CapThresholdProps {
  token: Token;
  type: 'supply' | 'borrow';
  tokenPriceCents: BigNumber;
  capTokens: BigNumber;
  balanceTokens: BigNumber;
}

export const CapThreshold: React.FC<CapThresholdProps> = ({
  type,
  tokenPriceCents,
  capTokens,
  balanceTokens,
  token,
}) => {
  const { t } = useTranslation();

  const {
    readableBalanceDollars,
    readableBalanceTokens,
    readableCapDollars,
    readableCapTokens,
    readableDeltaDollars,
    readableDeltaTokens,
    readableThresholdPercentage,
    thresholdPercentage,
  } = useMemo(() => {
    const tmpBalanceCents = balanceTokens.multipliedBy(tokenPriceCents);
    const tmpCapCents = capTokens.multipliedBy(tokenPriceCents);

    const tmpReadableBalanceDollars = formatCentsToReadableValue({
      value: tmpBalanceCents,
    });

    const tmpReadableBalanceTokens = formatTokensToReadableValue({
      value: balanceTokens,
      token,
      addSymbol: false,
    });

    const tmpReadableCapDollars = formatCentsToReadableValue({
      value: tmpCapCents,
    });

    const tmpReadableCapTokens = formatTokensToReadableValue({
      value: capTokens,
      token,
    });

    const tmpReadableDeltaDollars = formatCentsToReadableValue({
      value: tmpCapCents.minus(tmpBalanceCents),
    });

    const tmpReadableDeltaTokens = formatTokensToReadableValue({
      value: capTokens.isEqualTo(0) ? new BigNumber(0) : capTokens.minus(balanceTokens),
      token,
    });

    const thresholdPercentage = capTokens.isEqualTo(0)
      ? 100
      : balanceTokens.multipliedBy(100).div(capTokens).toNumber();

    const tmpReadableThresholdPercentage = formatPercentageToReadableValue(thresholdPercentage);

    return {
      readableBalanceDollars: tmpReadableBalanceDollars,
      readableBalanceTokens: tmpReadableBalanceTokens,
      readableCapDollars: tmpReadableCapDollars,
      readableCapTokens: tmpReadableCapTokens,
      readableDeltaDollars: tmpReadableDeltaDollars,
      readableDeltaTokens: tmpReadableDeltaTokens,
      readableThresholdPercentage: tmpReadableThresholdPercentage,
      thresholdPercentage,
    };
  }, [balanceTokens, capTokens, tokenPriceCents, token]);

  return (
    <div className="flex items-center space-x-4">
      <Tooltip
        title={
          type === 'supply'
            ? t('market.supplyCapThreshold.tooltip', {
                amountDollars: readableDeltaDollars,
                amountTokens: readableDeltaTokens,
              })
            : t('market.borrowCapThreshold.tooltip', {
                amountDollars: readableDeltaDollars,
                amountTokens: readableDeltaTokens,
              })
        }
      >
        <div className="relative flex items-center justify-center w-20 h-20">
          <ProgressCircle
            value={thresholdPercentage}
            sizePx={80}
            strokeWidthPx={5}
            className="absolute inset"
            fillColor={`url(#${THRESHOLD_GRADIENT_ID})`}
            defs={
              <linearGradient
                id={THRESHOLD_GRADIENT_ID}
                x1="68.5998"
                y1="55.4944"
                x2="-13.4919"
                y2="6.11727"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color={theme.colors.blue} />
                <stop offset="1" stop-color="#5CFFA2" />
              </linearGradient>
            }
          />

          <p className="text-sm text-center font-bold">{readableThresholdPercentage}</p>
        </div>
      </Tooltip>

      <div>
        <p className="text-grey mb-1 text-sm">
          {type === 'supply'
            ? t('market.supplyCapThreshold.title')
            : t('market.borrowCapThreshold.title')}
        </p>

        <p className="text-sm font-semibold sm:text-lg">
          {readableBalanceDollars} / {readableCapDollars}
        </p>

        <p className="text-grey text-xs">
          {readableBalanceTokens} / {readableCapTokens}
        </p>
      </div>
    </div>
  );
};
