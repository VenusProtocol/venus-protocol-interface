import type { TxType } from 'types';
import type { ApiTxType } from '../../types';

const API_TX_TYPE_TO_TX_TYPE_MAP: Record<ApiTxType, TxType> = {
  principal_supplied: 'principalSupplied',
  principal_withdrawn: 'principalWithdrawn',
  position_opened_with_principal: 'positionOpened',
  position_closed_with_profit: 'positionReducedWithProfit',
  position_closed_with_loss: 'positionReducedWithLoss',
  position_closed_with_loss_and_deactivated: 'positionClosedWithLoss',
  position_closed_with_profit_and_deactivated: 'positionClosedWithProfit',
  position_scaled: 'positionIncreased',
  profit_converted: 'profitConverted',
  mint: 'supply',
  borrow: 'borrow',
  redeem: 'withdraw',
  repay: 'repay',
  enter_market: 'enterMarket',
  exit_market: 'exitMarket',
};

export const convertToTxType = (txType: string) =>
  txType in API_TX_TYPE_TO_TX_TYPE_MAP
    ? API_TX_TYPE_TO_TX_TYPE_MAP[txType as keyof typeof API_TX_TYPE_TO_TX_TYPE_MAP]
    : undefined;
