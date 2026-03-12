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

export interface PositionFormProps {
  formValues: FormValues;
  setFormValues: (setter: FormValues | ((newFormValues: FormValues) => FormValues)) => void;
  limitShortTokens: BigNumber;
  position: YieldPlusPosition;
  balanceMutations: BalanceMutation[];
  submitButtonLabel: string;
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  isSubmitting: boolean;
  isNewPosition?: boolean;
  formError?: FormError;
  isLoading?: boolean;
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
}
