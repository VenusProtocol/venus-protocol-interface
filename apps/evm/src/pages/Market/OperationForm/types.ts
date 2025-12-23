export type CommonErrorCode =
  | 'SUPPLY_CAP_ALREADY_REACHED'
  | 'BORROW_CAP_ALREADY_REACHED'
  | 'HIGHER_THAN_BORROW_CAP'
  | 'HIGHER_THAN_SUPPLY_CAP'
  | 'SWAP_PRICE_IMPACT_TOO_HIGH'
  | 'NO_SWAP_QUOTE_FOUND'
  | 'HIGHER_THAN_LIQUIDITY'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT'
  | 'HIGHER_THAN_REPAY_BALANCE'
  | 'REQUIRES_RISK_ACKNOWLEDGEMENT'
  | 'TOO_RISKY';

export interface FormError<C extends string = never> {
  code: CommonErrorCode | C;
  message?: string;
}
