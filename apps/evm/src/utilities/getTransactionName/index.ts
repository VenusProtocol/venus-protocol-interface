import type { TFunction } from 'i18next';
import type { TxType } from 'types';

export interface GetTransactionNameInput {
  type: TxType;
  t: TFunction;
}

export const getTransactionName = ({ type, t }: GetTransactionNameInput) => {
  let name = '';
  let suffix = '';

  switch (type) {
    case 'supply':
    case 'repay':
    case 'borrow':
    case 'withdraw':
    case 'exitMarket':
    case 'enterMarket':
      suffix = t('account.transactions.txSource.venusCore');
      break;
    case 'hubSupply':
    case 'hubSupplyFromCollateral':
    case 'hubWithdraw':
      suffix = t('account.transactions.txSource.liquidityHub');
      break;
    case 'principalSupplied':
    case 'principalWithdrawn':
    case 'positionOpened':
    case 'profitConverted':
    case 'positionClosedWithProfit':
    case 'positionClosedWithLoss':
    case 'positionIncreased':
    case 'positionReducedWithLoss':
    case 'positionReducedWithProfit':
      suffix = t('account.transactions.txSource.trade');
      break;
  }

  switch (type) {
    case 'supply':
    case 'hubSupply':
      name = t('account.transactions.txType.mint');
      break;
    case 'hubSupplyFromCollateral':
      name = t('account.transactions.txType.mintFromCollateral');
      break;
    case 'repay':
      name = t('account.transactions.txType.repay');
      break;
    case 'borrow':
      name = t('account.transactions.txType.borrow');
      break;
    case 'withdraw':
    case 'hubWithdraw':
      name = t('account.transactions.txType.redeem');
      break;
    case 'exitMarket':
      name = t('account.transactions.txType.exitMarket');
      break;
    case 'enterMarket':
      name = t('account.transactions.txType.enterMarket');
      break;
    case 'principalSupplied':
      name = t('account.transactions.txType.principalSupplied');
      break;
    case 'principalWithdrawn':
      name = t('account.transactions.txType.principalWithdrawn');
      break;
    case 'positionOpened':
      name = t('account.transactions.txType.positionOpened');
      break;
    case 'profitConverted':
      name = t('account.transactions.txType.realizedPnl');
      break;
    case 'positionClosedWithProfit':
      name = t('account.transactions.txType.positionClosedWithProfit');
      break;
    case 'positionClosedWithLoss':
      name = t('account.transactions.txType.positionClosedWithLoss');
      break;
    case 'positionIncreased':
      name = t('account.transactions.txType.positionIncreased');
      break;
    case 'positionReducedWithLoss':
      name = t('account.transactions.txType.positionReducedWithLoss');
      break;
    case 'positionReducedWithProfit':
      name = t('account.transactions.txType.positionReducedWithProfit');
      break;
  }

  if (suffix) {
    name += ` • ${suffix}`;
  }

  return name;
};
