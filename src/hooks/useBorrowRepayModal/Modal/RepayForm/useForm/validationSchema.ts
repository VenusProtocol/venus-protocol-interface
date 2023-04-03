import * as yup from 'yup';

export type FormValues = yup.InferType<ReturnType<typeof getValidationSchema>>;

export enum ErrorCode {
  INVALID_TOKEN_AMOUNT = 'INVALID_TOKEN_AMOUNT',
  HIGHER_THAN_REPAY_BALANCE = 'HIGHER_THAN_REPAY_BALANCE', // value must be lower or equal to repay balance
  HIGHER_THAN_WALLET_BALANCE = 'HIGHER_THAN_WALLET_BALANCE', // value must be lower or equal to wallet balance
}

const getValidationSchema = ({
  repayBalanceTokens,
  walletBalanceTokens,
}: {
  repayBalanceTokens?: string;
  walletBalanceTokens?: string;
}) =>
  yup.object({
    amountTokens: yup
      .string()
      .positive(ErrorCode.INVALID_TOKEN_AMOUNT)
      .lowerThanOrEqualTo(repayBalanceTokens, ErrorCode.HIGHER_THAN_REPAY_BALANCE)
      .lowerThanOrEqualTo(walletBalanceTokens, ErrorCode.HIGHER_THAN_WALLET_BALANCE)
      .required(ErrorCode.INVALID_TOKEN_AMOUNT),
    fromToken: yup.object().token().required(),
    fixedRepayPercentage: yup.number().optional(),
  });

export default getValidationSchema;
