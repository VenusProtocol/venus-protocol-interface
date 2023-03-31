import * as yup from 'yup';

export type FormValues = yup.InferType<ReturnType<typeof getValidationSchema>>;

export enum ErrorCode {
  NOT_POSITIVE = 'NOT_POSITIVE', // value must be positive
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
    amount: yup
      .string()
      .positive(ErrorCode.NOT_POSITIVE)
      .lowerThanOrEqualTo(repayBalanceTokens, ErrorCode.HIGHER_THAN_REPAY_BALANCE)
      .lowerThanOrEqualTo(walletBalanceTokens, ErrorCode.HIGHER_THAN_WALLET_BALANCE)
      .required(),
    fromToken: yup.object().token().required(),
  });

export default getValidationSchema;
