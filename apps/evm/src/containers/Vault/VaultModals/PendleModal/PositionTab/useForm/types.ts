export interface FormValues {
  amountTokens: string;
}

export type FormErrorCode = 'EMPTY_TOKEN_AMOUNT' | 'HIGHER_THAN_WALLET_BALANCE';

export interface FormError {
  code: FormErrorCode;
  message?: string;
}
