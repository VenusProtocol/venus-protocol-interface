import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { useForm as useRhfForm } from 'react-hook-form';
import { z } from 'zod';

import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { calculateHealthFactor, convertMantissaToTokens } from 'utilities';

import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import type { FormValues } from '../types';

export enum ErrorCode {
  REQUIRES_RISK_ACKNOWLEDGEMENT = 'REQUIRES_RISK_ACKNOWLEDGEMENT',
}

export interface UseFormProps {
  vaiLiquidityMantissa?: BigNumber;
  accountMintableVaiMantissa?: BigNumber;
  userBorrowBalanceCents?: BigNumber;
  userLiquidationThresholdCents?: BigNumber;
  vaiPriceCents?: BigNumber;
}

export const useForm = ({
  vaiLiquidityMantissa,
  accountMintableVaiMantissa,
  userBorrowBalanceCents,
  userLiquidationThresholdCents,
  vaiPriceCents,
}: UseFormProps) => {
  const { t } = useTranslation();
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
      z
        .object({
          amountTokens: z.coerce
            .string()
            .min(1)
            .refine(value => +value > 0)
            .refine(
              value =>
                !vaiLiquidityTokens ||
                new BigNumber(vaiLiquidityTokens).isGreaterThanOrEqualTo(value),
              {
                message: t('vai.borrow.notice.amountHigherThanLiquidity'),
              },
            )
            .refine(
              value =>
                !accountMintableVaiTokens ||
                new BigNumber(accountMintableVaiTokens).isGreaterThanOrEqualTo(value),
              {
                message: t('vai.borrow.notice.amountHigherThanAccountMintableAmount'),
              },
            ),
          acknowledgeRisk: z.boolean(),
        })
        .refine(
          data => {
            if (
              !Number(data.amountTokens) ||
              !vaiPriceCents ||
              !userBorrowBalanceCents ||
              !userLiquidationThresholdCents
            ) {
              return true;
            }

            const amountCents = new BigNumber(data.amountTokens).multipliedBy(vaiPriceCents);

            const hypothericalHealthFactor = calculateHealthFactor({
              borrowBalanceCents: userBorrowBalanceCents.plus(amountCents).toNumber(),
              liquidationThresholdCents: userLiquidationThresholdCents.toNumber(),
            });

            // Mark form as invalid if hypothetical health factor is below moderate threshold and
            // user hasn't acknowledged the risk
            return (
              hypothericalHealthFactor >= HEALTH_FACTOR_MODERATE_THRESHOLD || !!data.acknowledgeRisk
            );
          },
          {
            path: ['acknowledgeRisk'],
            message: ErrorCode.REQUIRES_RISK_ACKNOWLEDGEMENT,
          },
        ) satisfies z.ZodType<FormValues>,
    [
      vaiLiquidityTokens,
      accountMintableVaiTokens,
      userBorrowBalanceCents,
      userLiquidationThresholdCents,
      vaiPriceCents,
      t,
    ],
  );

  const form = useRhfForm({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountTokens: '',
      acknowledgeRisk: false,
    },
  });

  return { form };
};
