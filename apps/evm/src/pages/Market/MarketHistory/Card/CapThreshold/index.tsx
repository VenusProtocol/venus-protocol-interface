import { formatCentsToReadableValue, formatTokensToReadableValue, theme } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { ProgressCircle, Tooltip } from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Token } from 'types';

import { formatPercentageToReadableValue } from 'utilities';

const THRESHOLD_GRADIENT_ID = 'cap-threshold-gradient';

export interface CapThresholdProps {
  token: Token;
  type: 'supply' | 'borrow';
  tokenPriceCents: BigNumber;
  capTokens: BigNumber;
  limitTokens: BigNumber;
  balanceTokens: BigNumber;
}

export const CapThreshold: React.FC<CapThresholdProps> = ({
  type,
  tokenPriceCents,
  capTokens,
  limitTokens,
  balanceTokens,
  token,
}) => {
  const { t, Trans } = useTranslation();

  const {
    readableBalanceDollars,
    readableBalanceTokens,
    readableCapTokens,
    readableLimitTokens,
    readableLimitDollars,
    readableDeltaDollars,
    readableDeltaTokens,
    readableThresholdPercentage,
    thresholdPercentage,
  } = useMemo(() => {
    const balanceCents = balanceTokens.multipliedBy(tokenPriceCents);

    const tmpReadableBalanceDollars = formatCentsToReadableValue({
      value: balanceCents,
    });

    const tmpReadableBalanceTokens = formatTokensToReadableValue({
      value: balanceTokens,
      token,
      addSymbol: false,
    });

    const tmpReadableCapTokens = formatTokensToReadableValue({
      value: capTokens,
      token,
    });

    const tmpReadableLimitTokens = formatTokensToReadableValue({
      value: limitTokens,
      token,
    });

    const limitCents = limitTokens.multipliedBy(tokenPriceCents);
    const tmpReadableLimitDollars = formatCentsToReadableValue({ value: limitCents });

    const deltaCents = limitCents.minus(balanceCents);
    const tmpReadableDeltaDollars = formatCentsToReadableValue({
      value: deltaCents.isLessThanOrEqualTo(0) ? 0 : deltaCents,
    });

    const deltaTokens = limitTokens.minus(balanceTokens);
    const tmpReadableDeltaTokens = formatTokensToReadableValue({
      value: deltaTokens.isLessThanOrEqualTo(0) ? new BigNumber(0) : deltaTokens,
      token,
    });

    const thresholdPercentage = limitTokens.isEqualTo(0)
      ? 100
      : balanceTokens.multipliedBy(100).div(limitTokens).toNumber();

    const tmpReadableThresholdPercentage = formatPercentageToReadableValue(thresholdPercentage);

    return {
      readableBalanceDollars: tmpReadableBalanceDollars,
      readableBalanceTokens: tmpReadableBalanceTokens,
      readableCapTokens: tmpReadableCapTokens,
      readableLimitTokens: tmpReadableLimitTokens,
      readableLimitDollars: tmpReadableLimitDollars,
      readableDeltaDollars: tmpReadableDeltaDollars,
      readableDeltaTokens: tmpReadableDeltaTokens,
      readableThresholdPercentage: tmpReadableThresholdPercentage,
      thresholdPercentage,
    };
  }, [balanceTokens, capTokens, tokenPriceCents, token, limitTokens]);

  return (
    <div className="flex items-center space-x-4">
      <Tooltip
        content={
          type === 'supply' ? (
            t('market.supplyCapThreshold.tooltip', {
              amountDollars: readableDeltaDollars,
              amountTokens: readableDeltaTokens,
            })
          ) : (
            <Trans
              i18nKey="market.borrowCapThreshold.tooltip"
              values={{
                amountDollars: readableDeltaDollars,
                amountTokens: readableDeltaTokens,
                capTokens: readableCapTokens,
              }}
              components={{
                br: <br />,
              }}
            />
          )
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
                <stop stopColor={theme.colors.blue} />
                <stop offset="1" stopColor="#5CFFA2" />
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
          {readableBalanceDollars} / {readableLimitDollars}
        </p>

        <p className="text-grey text-xs">
          {readableBalanceTokens} / {readableLimitTokens}
        </p>
      </div>
    </div>
  );
};
