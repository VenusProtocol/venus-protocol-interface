import type { TFunction } from 'i18next';
import type { Tx, TxType } from 'types';

export interface GetTransactionNameInput {
  transaction: Tx | TxType;
  t: TFunction;
}

export const getTransactionName = ({ transaction, t }: GetTransactionNameInput) => {
  const txType = typeof transaction === 'string' ? transaction : transaction.txType;
  const liquidityHubSuffix =
    typeof transaction !== 'string' && 'vhToken' in transaction
      ? ` • ${t('layouts.menu.markets.liquidityHub.label')}`
      : '';

  switch (txType) {
    case 'supply':
      return `${t('account.transactions.txType.mint')}${liquidityHubSuffix}`;
    case 'repay':
      return t('account.transactions.txType.repay');
    case 'borrow':
      return t('account.transactions.txType.borrow');
    case 'withdraw':
      return `${t('account.transactions.txType.redeem')}${liquidityHubSuffix}`;
    case 'exitMarket':
      return t('account.transactions.txType.exitMarket');
    case 'enterMarket':
      return t('account.transactions.txType.enterMarket');
    case 'principalSupplied':
      return t('account.transactions.txType.principalSupplied');
    case 'principalWithdrawn':
      return t('account.transactions.txType.principalWithdrawn');
    case 'positionOpened':
      return t('account.transactions.txType.positionOpened');
    case 'profitConverted':
      return t('account.transactions.txType.realizedPnl');
    case 'positionClosedWithProfit':
      return t('account.transactions.txType.positionClosedWithProfit');
    case 'positionClosedWithLoss':
      return t('account.transactions.txType.positionClosedWithLoss');
    case 'positionIncreased':
      return t('account.transactions.txType.positionIncreased');
    case 'positionReducedWithLoss':
      return t('account.transactions.txType.positionReducedWithLoss');
    case 'positionReducedWithProfit':
      return t('account.transactions.txType.positionReducedWithProfit');
  }
};
