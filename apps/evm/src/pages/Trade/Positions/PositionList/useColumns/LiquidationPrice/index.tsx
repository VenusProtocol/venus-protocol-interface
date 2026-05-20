import { useHealthFactor } from 'hooks/useHealthFactor';
import { useTranslation } from 'libs/translations';
import { formatLiquidationPriceTokensToReadableValue } from 'pages/Trade/formatLiquidationPriceTokensToReadableValue';
import type { Token } from 'types';
import { calculateHealthFactor } from 'utilities';

export interface LiquidationPriceProps {
  liquidationPriceTokens: BigNumber;
  token: Token;
  liquidationThresholdCents: number;
  borrowBalanceCents: number;
}

export const LiquidationPrice: React.FC<LiquidationPriceProps> = ({
  liquidationPriceTokens,
  token,
  liquidationThresholdCents,
  borrowBalanceCents,
}) => {
  const { t } = useTranslation();

  const healthFactor = calculateHealthFactor({
    liquidationThresholdCents,
    borrowBalanceCents,
  });

  const { textClass } = useHealthFactor({ value: healthFactor });

  const text = formatLiquidationPriceTokensToReadableValue({
    value: liquidationPriceTokens,
    token,
    t,
  });

  return <span className={textClass}>{text}</span>;
};
