import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useForm as useRhfForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetToken } from 'libs/tokens';
import { convertMantissaToTokens } from 'utilities';

import { FormValues } from '../../types';

export enum ErrorCode {
  HIGHER_THAN_WALLET_BALANCE = 'HIGHER_THAN_WALLET_BALANCE',
  HIGHER_THAN_BORROW_BALANCE = 'HIGHER_THAN_BORROW_BALANCE',
  HIGHER_THAN_WALLET_SPENDING_LIMIT = 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
}

export interface UseFormProps {
  userVaiWalletBalanceMantissa?: BigNumber;
  userVaiBorrowBalanceMantissa?: BigNumber;
  userWalletSpendingLimitTokens?: BigNumber;
}

export const useForm = ({
  userVaiWalletBalanceMantissa,
  userVaiBorrowBalanceMantissa,
  userWalletSpendingLimitTokens,
}: UseFormProps) => {
  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const userVaiWalletBalanceTokens = useMemo(
    () =>
      userVaiWalletBalanceMantissa &&
      convertMantissaToTokens({ value: userVaiWalletBalanceMantissa, token: vai }),
    [userVaiWalletBalanceMantissa, vai],
  );

  const userVaiBorrowBalanceTokens = useMemo(
    () =>
      userVaiBorrowBalanceMantissa &&
      convertMantissaToTokens({ value: userVaiBorrowBalanceMantissa, token: vai }),
    [userVaiBorrowBalanceMantissa, vai],
  );

  const limitTokens = useMemo(() => {
    if (!userVaiWalletBalanceTokens || !userVaiBorrowBalanceTokens) {
      return undefined;
    }

    let tmpLimitTokens = BigNumber.min(userVaiWalletBalanceTokens, userVaiBorrowBalanceTokens);

    // If user has set a spending limit for VAI, then we take it consideration to define the limit
    // they can spend. Otherwise we let the limit be defined by their VAI wallet and borrow balances
    // (an error message will be displayed if the amount entered is higher than their spending limit
    if (userWalletSpendingLimitTokens && userWalletSpendingLimitTokens.isGreaterThan(0)) {
      tmpLimitTokens = BigNumber.min(tmpLimitTokens, userWalletSpendingLimitTokens);
    }

    return tmpLimitTokens;
  }, [userVaiWalletBalanceTokens, userVaiBorrowBalanceTokens, userWalletSpendingLimitTokens]);

  const formSchema = useMemo(
    () =>
      z.object({
        amountTokens: z.coerce
          .string()
          .min(1)
          .refine(value => +value > 0)
          .refine(
            value =>
              !userVaiWalletBalanceTokens ||
              new BigNumber(userVaiWalletBalanceTokens).isGreaterThanOrEqualTo(value),
            {
              message: ErrorCode.HIGHER_THAN_WALLET_BALANCE,
            },
          )
          .refine(
            value =>
              !userVaiBorrowBalanceTokens ||
              new BigNumber(userVaiBorrowBalanceTokens).isGreaterThanOrEqualTo(value),
            {
              message: ErrorCode.HIGHER_THAN_BORROW_BALANCE,
            },
          )
          .refine(
            value =>
              !userWalletSpendingLimitTokens ||
              userWalletSpendingLimitTokens.isEqualTo(0) ||
              new BigNumber(userWalletSpendingLimitTokens).isGreaterThanOrEqualTo(value),
            {
              message: ErrorCode.HIGHER_THAN_WALLET_SPENDING_LIMIT,
            },
          ),
      }) satisfies z.ZodType<FormValues>,
    [userVaiWalletBalanceTokens, userVaiBorrowBalanceTokens, userWalletSpendingLimitTokens],
  );

  const form = useRhfForm({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountTokens: '',
    },
  });

  return { limitTokens, form };
};
