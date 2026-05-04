import type { TxType } from 'types';

import type { IconName } from '../../../Icon';

export const getTransactionIcon = (txType: TxType): IconName => {
  switch (txType) {
    case 'enterMarket':
      return 'transactionCollateral';
    case 'exitMarket':
      return 'close';
    case 'supply':
    case 'repay':
    case 'principalSupplied':
    case 'positionIncreased':
    case 'positionOpened':
    case 'positionClosedWithLoss':
    case 'positionClosedWithProfit':
      return 'transactionIn';
    default:
      return 'transactionOut';
  }
};
