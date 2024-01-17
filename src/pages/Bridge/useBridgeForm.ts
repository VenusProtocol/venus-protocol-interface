import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  useGetBalanceOf,
  useGetTokenUsdPrice,
  useGetXvsBridgeFeeEstimation,
  useGetXvsBridgeStatus,
} from 'clients/api';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'packages/translations';
import { chains, useAccountAddress, useChainId } from 'packages/wallet';
import { ChainId, Token } from 'types';
import {
  convertDollarsToCents,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

interface UseBridgeFormInput {
  toChainId: ChainId | undefined;
  xvs: Token | undefined;
}

const useBridgeForm = ({ toChainId, xvs }: UseBridgeFormInput) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const { nativeToken } = useGetChainMetadata();
  const { data: getTokenUsdPriceData } = useGetTokenUsdPrice({
    token: xvs,
  });

  const xvsPriceUsd = useMemo(
    () => getTokenUsdPriceData?.tokenPriceUsd || new BigNumber(0),
    [getTokenUsdPriceData?.tokenPriceUsd],
  );

  const { data: getXvsBridgeStatusData } = useGetXvsBridgeStatus(
    {
      toChainId: toChainId!,
    },
    {
      enabled: !!toChainId,
    },
  );

  const { data: getBalanceOfNativeTokenData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: nativeToken,
    },
    {
      enabled: !!accountAddress,
    },
  );
  const nativeTokenBalanceMantissa = useMemo(
    () =>
      getBalanceOfNativeTokenData ? getBalanceOfNativeTokenData.balanceMantissa : new BigNumber(0),
    [getBalanceOfNativeTokenData],
  );

  const [maxSingleTransactionLimitUsd, dailyLimitResetTimestamp] = useMemo(
    () => [
      getXvsBridgeStatusData?.maxSingleTransactionLimitUsd || new BigNumber(0),
      getXvsBridgeStatusData?.dailyLimitResetTimestamp || new BigNumber(0),
    ],
    [getXvsBridgeStatusData],
  );

  const [remainingXvsDailyLimitUsd, remainingXvsDailyLimitTokens] = useMemo(() => {
    if (getXvsBridgeStatusData) {
      const { totalTransferredLast24HourUsd, maxDailyLimitUsd } = getXvsBridgeStatusData;
      const remainingUsdValue = maxDailyLimitUsd.minus(totalTransferredLast24HourUsd);
      const remaningTokensAmount = !xvsPriceUsd.isZero()
        ? remainingUsdValue.dividedBy(xvsPriceUsd)
        : new BigNumber(0);
      return [remainingUsdValue, remaningTokensAmount];
    }

    return [new BigNumber(0), new BigNumber(0)];
  }, [getXvsBridgeStatusData, xvsPriceUsd]);

  const validateBridgeFeeMantissa = useCallback(
    (bridgeFeeMantissa: unknown) => {
      if (BigNumber.isBigNumber(bridgeFeeMantissa)) {
        return bridgeFeeMantissa.gt(0) && bridgeFeeMantissa.lte(nativeTokenBalanceMantissa);
      }

      return true;
    },
    [nativeTokenBalanceMantissa],
  );

  const validateAmountMantissa = useCallback(
    (v: string, ctx: z.RefinementCtx) => {
      const xvsAmountTokens = new BigNumber(v);
      const xvsAmountUsd = xvsAmountTokens.times(xvsPriceUsd);
      const isSingleTransactionLimitExceeded = xvsAmountUsd.gt(maxSingleTransactionLimitUsd);
      const maxSingleTransactionLimitTokens = maxSingleTransactionLimitUsd.dividedBy(xvsPriceUsd);

      if (isSingleTransactionLimitExceeded) {
        const readableAmountTokens = formatTokensToReadableValue({
          value: maxSingleTransactionLimitTokens,
          token: xvs,
        });
        const readableAmountUsd = formatCentsToReadableValue({
          value: convertDollarsToCents(maxSingleTransactionLimitUsd),
        });
        ctx.addIssue({
          code: 'custom',
          message: t('bridgePage.errors.singleTransactionLimitExceeded.message', {
            readableAmountTokens,
            readableAmountUsd,
          }),
          path: ['singleTransactionLimitExceeded'],
        });
      }

      const isDailyTransactionLimitExceeded = xvsAmountUsd.gt(remainingXvsDailyLimitUsd);
      if (isDailyTransactionLimitExceeded) {
        const readableAmountTokens = formatTokensToReadableValue({
          value: remainingXvsDailyLimitTokens,
          token: xvs,
        });
        const readableAmountUsd = formatCentsToReadableValue({
          value: convertDollarsToCents(remainingXvsDailyLimitUsd),
        });
        const date = fromUnixTime(dailyLimitResetTimestamp.toNumber());
        date.setDate(date.getDate() + 1);
        ctx.addIssue({
          code: 'custom',
          message: t('bridgePage.errors.dailyTransactionLimitExceeded.message', {
            readableAmountTokens,
            readableAmountUsd,
            date,
          }),
          path: ['dailyTransactionLimitExceeded'],
        });
      }
    },
    [
      dailyLimitResetTimestamp,
      maxSingleTransactionLimitUsd,
      t,
      remainingXvsDailyLimitTokens,
      remainingXvsDailyLimitUsd,
      xvsPriceUsd,
      xvs,
    ],
  );

  const formSchema = z.object({
    fromChainId: z.nativeEnum(ChainId),
    toChainId: z.nativeEnum(ChainId),
    amountTokens: z.string().min(1).superRefine(validateAmountMantissa),
    bridgeEstimatedFeeMantissa: z.custom<BigNumber | undefined>(validateBridgeFeeMantissa),
  });

  const defaultValues = useMemo(
    () => ({
      fromChainId: chainId,
      toChainId: chains.find(chain => chain.id !== chainId)?.id as ChainId,
      amountTokens: '',
      nativeTokenBalanceMantissa,
    }),
    [chainId, nativeTokenBalanceMantissa],
  );
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { toChainId: formToChainId, amountTokens } = form.watch();
  const amountMantissa = useDebounceValue(
    xvs
      ? convertTokensToMantissa({
          value: new BigNumber(amountTokens) || new BigNumber(0),
          token: xvs,
        })
      : new BigNumber(0),
  );

  const { data: getXvsBridgeFeeEstimationData } = useGetXvsBridgeFeeEstimation(
    {
      accountAddress: accountAddress || '',
      destinationChain: formToChainId,
      amountMantissa,
    },
    {
      enabled: !!accountAddress && amountMantissa.gt(0),
    },
  );

  const bridgeEstimatedFeeMantissa = getXvsBridgeFeeEstimationData?.estimationFeeMantissa;

  useEffect(() => {
    form.setValue('bridgeEstimatedFeeMantissa', bridgeEstimatedFeeMantissa, {
      shouldValidate: true,
    });
  }, [form, bridgeEstimatedFeeMantissa]);

  return { ...form, amountMantissa };
};

export default useBridgeForm;
