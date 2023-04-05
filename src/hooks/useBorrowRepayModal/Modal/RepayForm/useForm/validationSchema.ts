import { useMemo } from 'react';
import { Swap } from 'types';
import * as yup from 'yup';

export type FormValues = yup.InferType<ReturnType<typeof getValidationSchema>>;

export enum ErrorCode {
  INVALID_TOKEN_AMOUNT = 'INVALID_TOKEN_AMOUNT',
  HIGHER_THAN_REPAY_BALANCE = 'HIGHER_THAN_REPAY_BALANCE', // value must be lower or equal to repay balance
  HIGHER_THAN_WALLET_BALANCE = 'HIGHER_THAN_WALLET_BALANCE', // value must be lower or equal to wallet balance
}

export const getValidationSchema = ({
  repayBalanceTokens,
  walletBalanceTokens,
}: {
  repayBalanceTokens?: string;
  walletBalanceTokens?: string;
  swap?: Swap;
}) =>
  yup.object({
    amountTokens: yup
      .string()
      .positive(ErrorCode.INVALID_TOKEN_AMOUNT)
      .lowerThanOrEqualTo(walletBalanceTokens, ErrorCode.HIGHER_THAN_WALLET_BALANCE)
      .lowerThanOrEqualTo(repayBalanceTokens, ErrorCode.HIGHER_THAN_REPAY_BALANCE)
      .required(ErrorCode.INVALID_TOKEN_AMOUNT),
    fromToken: yup.object().token().required(),
    fixedRepayPercentage: yup.number().optional(),
  });

const useGetValidationSchema = ({
  repayBalanceTokens,
  walletBalanceTokens,
  swap,
}: Parameters<typeof getValidationSchema>[0]) =>
  useMemo(
    () =>
      getValidationSchema({
        repayBalanceTokens,
        walletBalanceTokens,
        swap,
      }),
    [repayBalanceTokens, walletBalanceTokens, swap],
  );

export default useGetValidationSchema;
