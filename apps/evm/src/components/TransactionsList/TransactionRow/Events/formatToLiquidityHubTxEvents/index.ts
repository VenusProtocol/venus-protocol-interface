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
  const amounts = transaction.amounts || [];

  return amounts.map<EventProps>((amount, index) => {
    let description = formatCentsToReadableValue({
      value: amount.amountCents,
    });

    if (amounts.length > 1) {
      description += ` • ${
        index === 0 ? t('transactions.venusCore.label') : t('transactions.liquidityHub.label')
      }`;
    }

    return {
      token: amount.token,
      title: formatTokensToReadableValue({
        token: amount.token,
        value: amount.amountTokens,
      }),
      description,
    };
  });
};
