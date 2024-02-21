import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useForm as useRHFForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetToken } from 'libs/tokens';
import { convertMantissaToTokens } from 'utilities';

import { FormValues } from '../types';

export interface UseFormProps {
  borrowableAmountMantissa?: BigNumber;
}

export const useForm = ({ borrowableAmountMantissa }: UseFormProps) => {
  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const borrowableAmountTokens = useMemo(
    () =>
      borrowableAmountMantissa &&
      convertMantissaToTokens({ value: borrowableAmountMantissa, token: vai }),
    [borrowableAmountMantissa, vai],
  );

  const formSchema = z.object({
    amountTokens: z.coerce
      .string()
      .min(1)
      .superRefine((value, context) => {
        if (borrowableAmountTokens && new BigNumber(value).isGreaterThan(borrowableAmountTokens)) {
          context.addIssue({
            code: 'too_big',
            type: 'number',
            maximum: borrowableAmountTokens.toNumber(),
            inclusive: true,
          });
        }
      }),
  }) satisfies z.ZodType<FormValues>;

  const form = useRHFForm({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountTokens: '',
    },
  });

  return form;
};
