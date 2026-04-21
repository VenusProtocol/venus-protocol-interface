import type { YieldPlusTx } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { EventProps } from '../Event';

export const formatToYieldPlusTxEvents = ({ transaction }: { transaction: YieldPlusTx }) =>
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
