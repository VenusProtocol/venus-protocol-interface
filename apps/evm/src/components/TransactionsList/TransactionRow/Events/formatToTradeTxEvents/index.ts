import type { TradeTx } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { EventProps } from '../Event';

export const formatToTradeTxEvents = ({ transaction }: { transaction: TradeTx }) =>
  (transaction.amounts || []).map<EventProps>(amount => ({
    token: amount.token,
    title: formatTokensToReadableValue({
      token: amount.token,
      value: amount.amountTokens,
    }),
    description: formatCentsToReadableValue({
      value: amount.amountCents,
    }),
  }));
