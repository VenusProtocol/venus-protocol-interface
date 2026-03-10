import { TxType } from 'types';

import type { IconName } from '../../../Icon';

export const getTransactionIcon = (txType: TxType): IconName => {
  switch (txType) {
    case TxType.Mint:
    case TxType.Repay:
      return 'transactionIn';
    case TxType.Borrow:
    case TxType.Redeem:
      return 'transactionOut';
    default:
      return 'transactionCollateral';
  }
};
