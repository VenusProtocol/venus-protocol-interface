import type { TxType } from 'types';

import type { IconName } from '../../../Icon';

export const getTransactionIcon = (txType: TxType): IconName => {
  switch (txType) {
    case 'enterMarket':
    case 'positionOpened':
      return 'transactionCollateral';
    case 'exitMarket':
    case 'positionClosedWithLoss':
    case 'positionClosedWithProfit':
      return 'close';
    case 'supply':
    case 'repay':
    case 'principalSupplied':
    case 'positionIncreased':
      return 'transactionIn';
    default:
      return 'transactionOut';
  }
};
