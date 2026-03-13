import type {
  BalanceMutation,
  CommonTxFormErrorCode,
  SwapQuote,
  Token,
  TxFormError,
  YieldPlusPosition,
} from 'types';

export interface FormValues {
  leverageFactor: number;
  dsaToken: Token;
  dsaAmountTokens: string;
  shortAmountTokens: string;
  longAmountTokens: string;
  acknowledgeRisk: boolean;
  acknowledgeHighPriceImpact: boolean;
}

export type FormErrorCode =
  | CommonTxFormErrorCode
  | 'EMPTY_DSA_TOKEN_AMOUNT'
  | 'EMPTY_SHORT_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT'
  | 'MISSING_DATA'
  | 'HIGHER_THAN_AVAILABLE_SHORT_AMOUNT';

export type FormError = TxFormError<FormErrorCode>;

export type PositionFormAction = 'open' | 'increase' | 'reduce';

export interface PositionFormProps {
  formValues: FormValues;
  setFormValues: (setter: FormValues | ((newFormValues: FormValues) => FormValues)) => void;
  position: YieldPlusPosition;
  balanceMutations: BalanceMutation[];
  submitButtonLabel: string;
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  isSubmitting: boolean;
  action: PositionFormAction;
  limitShortTokens?: BigNumber;
  limitLongTokens?: BigNumber;
  formError?: FormError;
  isLoading?: boolean;
  actionSwapQuote?: SwapQuote;
  actionSwapQuoteErrorCode?: string;
  profitSwapQuote?: SwapQuote;
  profitSwapQuoteErrorCode?: string;
  lossSwapQuote?: SwapQuote;
  lossSwapQuoteErrorCode?: string;
}
