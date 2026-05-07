import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';
import { useForm as useRhfForm } from 'react-hook-form';
import z from 'zod';

import { useTranslation } from 'libs/translations';

export interface FormValues {
  fromAmountTokens: string;
}

export const initialFormValues: FormValues = {
  fromAmountTokens: '',
};

export const useForm = ({
  limitFromTokens,
  walletSpendingLimitTokens,
}: {
  limitFromTokens?: BigNumber;
  walletSpendingLimitTokens?: BigNumber;
}) => {
  const { t } = useTranslation();

  const formSchema = z
    .object({
      fromAmountTokens: z.string().superRefine((v: string, ctx: z.RefinementCtx) => {
        const value = new BigNumber(v || 0);

        if (value.isZero()) {
          ctx.addIssue({
            code: 'custom',
          });
          return;
        }

        if (limitFromTokens && value.isGreaterThan(limitFromTokens)) {
          ctx.addIssue({
            code: 'custom',
            message: t('operationForm.error.higherThanAvailableAmount'),
          });
          return;
        }

        if (
          walletSpendingLimitTokens?.isGreaterThan(0) &&
          value.isGreaterThan(walletSpendingLimitTokens)
        ) {
          ctx.addIssue({
            code: 'custom',
            message: t('operationForm.error.higherThanWalletSpendingLimit'),
          });
          return;
        }
      }),
    })
    .required();

  const form = useRhfForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: revalidate form when parameters change
  useEffect(() => {
    form.trigger('fromAmountTokens');
  }, [form.trigger, limitFromTokens?.toFixed(), walletSpendingLimitTokens?.toFixed()]);

  return form;
};
