import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useForm as useRhfForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetToken } from 'libs/tokens';
import { convertMantissaToTokens } from 'utilities';

import type { FormValues } from '../../types';

export enum ErrorCode {
  HIGHER_THAN_LIQUIDITY = 'HIGHER_THAN_LIQUIDITY',
  HIGHER_THAN_MINTABLE_AMOUNT = 'HIGHER_THAN_MINTABLE_AMOUNT',
}

export interface UseFormProps {
  vaiLiquidityMantissa?: BigNumber;
  accountMintableVaiMantissa?: BigNumber;
}

export const useForm = ({ vaiLiquidityMantissa, accountMintableVaiMantissa }: UseFormProps) => {
  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const vaiLiquidityTokens = useMemo(
    () =>
      vaiLiquidityMantissa && convertMantissaToTokens({ value: vaiLiquidityMantissa, token: vai }),
    [vaiLiquidityMantissa, vai],
  );

  const accountMintableVaiTokens = useMemo(
    () =>
      accountMintableVaiMantissa &&
      convertMantissaToTokens({ value: accountMintableVaiMantissa, token: vai }),
    [accountMintableVaiMantissa, vai],
  );

  const formSchema = useMemo(
    () =>
      z.object({
        amountTokens: z.coerce
          .string()
          .min(1)
          .refine(value => +value > 0)
          .refine(
            value =>
              !vaiLiquidityTokens ||
              new BigNumber(vaiLiquidityTokens).isGreaterThanOrEqualTo(value),
            {
              message: ErrorCode.HIGHER_THAN_LIQUIDITY,
            },
          )
          .refine(
            value =>
              !accountMintableVaiTokens ||
              new BigNumber(accountMintableVaiTokens).isGreaterThanOrEqualTo(value),
            {
              message: ErrorCode.HIGHER_THAN_MINTABLE_AMOUNT,
            },
          ),
      }) satisfies z.ZodType<FormValues>,
    [vaiLiquidityTokens, accountMintableVaiTokens],
  );

  const form = useRhfForm({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountTokens: '',
    },
  });

  return { form };
};
