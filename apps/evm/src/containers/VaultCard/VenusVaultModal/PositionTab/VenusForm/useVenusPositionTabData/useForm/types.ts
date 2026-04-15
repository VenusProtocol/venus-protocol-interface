export interface FormValues {
  tokenAmount: string;
}

export type FormErrorCode = 'EMPTY_TOKEN_AMOUNT' | 'HIGHER_THAN_AVAILABLE';

export interface FormError {
  code: FormErrorCode;
  message?: string;
}
