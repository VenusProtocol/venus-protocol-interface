import type { TFunction } from 'i18next';
import { TxType } from 'types';

export const getTransactionTitle = (txType: TxType, t: TFunction) => {
  switch (txType) {
    case TxType.Mint:
      return t('dashboard.transactions.txType.mint');
    case TxType.Repay:
      return t('dashboard.transactions.txType.repay');
    case TxType.Borrow:
      return t('dashboard.transactions.txType.borrow');
    case TxType.Redeem:
      return t('dashboard.transactions.txType.redeem');
    case TxType.Approve:
      return t('dashboard.transactions.txType.approve');
    case TxType.ExitMarket:
      return t('dashboard.transactions.txType.exitMarket');
    default:
      return t('dashboard.transactions.txType.enterMarket');
  }
};
