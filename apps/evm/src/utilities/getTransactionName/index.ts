import type { TFunction } from 'i18next';
import { TxType } from 'types';

export interface GetTransactionNameInput {
  txType: TxType;
  t: TFunction;
}

export const getTransactionName = ({ txType, t }: GetTransactionNameInput) => {
  switch (txType) {
    case TxType.Mint:
      return t('account.transactions.txType.mint');
    case TxType.Repay:
      return t('account.transactions.txType.repay');
    case TxType.Borrow:
      return t('account.transactions.txType.borrow');
    case TxType.Redeem:
      return t('account.transactions.txType.redeem');
    case TxType.ExitMarket:
      return t('account.transactions.txType.exitMarket');
    case TxType.EnterMarket:
      return t('account.transactions.txType.enterMarket');
  }
};
