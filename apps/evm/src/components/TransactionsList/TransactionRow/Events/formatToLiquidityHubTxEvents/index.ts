import type { TFunction } from 'i18next';
import type { LiquidityHubTx } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { EventProps } from '../Event';

export const formatToLiquidityHubTxEvents = ({
  transaction,
  t,
}: {
  transaction: LiquidityHubTx;
  t: TFunction;
}) => {
  const { amounts, vhToken } = transaction;
  const primaryAmount = amounts?.[0];
  const token = vhToken.underlyingToken;
  const liquidityHubLabel = t('layouts.menu.markets.liquidityHub.label');

  const title = formatTokensToReadableValue({
    token,
    value: primaryAmount?.amountTokens,
  });
  const description = primaryAmount
    ? `${formatCentsToReadableValue({
        value: primaryAmount.amountCents,
      })} • ${token.symbol} • ${liquidityHubLabel}`
    : liquidityHubLabel;

  const event: EventProps = {
    token,
    title,
    description,
  };

  return [event];
};
