import { theme } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';
import { useId, useMemo } from 'react';

import type { Token } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { ProgressCircle } from '../ProgressCircle';
import { Tooltip, type TooltipProps } from '../Tooltip';

export interface CapProgressCircleProps {
  token: Token;
  title: string;
  tokenPriceCents: BigNumber;
  tooltip?: TooltipProps['content'];
  limitTokens: BigNumber;
  valueTokens: BigNumber;
}

export const CapProgressCircle: React.FC<CapProgressCircleProps> = ({
  title,
  tokenPriceCents,
  tooltip,
  limitTokens,
  valueTokens,
  token,
}) => {
  const gradientId = useId().replace(/:/g, '');

  const {
    readableLimitDollars,
    readableLimitTokens,
    readableThresholdPercentage,
    readableValueDollars,
    readableValueTokens,
    thresholdPercentage,
  } = useMemo(() => {
    const valueCents = valueTokens.multipliedBy(tokenPriceCents);
    const limitCents = limitTokens.multipliedBy(tokenPriceCents);

    const tmpReadableValueDollars = formatCentsToReadableValue({
      value: valueCents,
    });

    const tmpReadableValueTokens = formatTokensToReadableValue({
      value: valueTokens,
      token,
      addSymbol: false,
    });

    const tmpReadableLimitTokens = formatTokensToReadableValue({
      value: limitTokens,
      token,
    });

    const tmpReadableLimitDollars = formatCentsToReadableValue({ value: limitCents });

    const thresholdPercentage = limitTokens.isEqualTo(0)
      ? 100
      : valueTokens.multipliedBy(100).div(limitTokens).toNumber();

    const tmpReadableThresholdPercentage = formatPercentageToReadableValue(thresholdPercentage);

    return {
      readableLimitDollars: tmpReadableLimitDollars,
      readableLimitTokens: tmpReadableLimitTokens,
      readableThresholdPercentage: tmpReadableThresholdPercentage,
      readableValueDollars: tmpReadableValueDollars,
      readableValueTokens: tmpReadableValueTokens,
      thresholdPercentage,
    };
  }, [limitTokens, tokenPriceCents, token, valueTokens]);

  const progressCircle = (
    <div className="relative flex items-center justify-center w-20 h-20">
      <ProgressCircle
        value={thresholdPercentage}
        sizePx={80}
        strokeWidthPx={5}
        className="absolute inset"
        fillColor={`url(#${gradientId})`}
        defs={
          <linearGradient
            id={gradientId}
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
  );

  const content = (
    <div className="flex items-center space-x-4">
      {tooltip ? <Tooltip content={tooltip}>{progressCircle}</Tooltip> : progressCircle}

      <div>
        <p className="text-grey mb-1 text-sm">{title}</p>

        <p className="text-sm font-semibold sm:text-lg">
          {readableValueDollars} / {readableLimitDollars}
        </p>

        <p className="text-grey text-xs">
          {readableValueTokens} / {readableLimitTokens}
        </p>
      </div>
    </div>
  );

  return content;
};
