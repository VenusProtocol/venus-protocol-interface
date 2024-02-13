import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useTranslation } from 'libs/translations';
import { chains, useAccountAddress, useChainId } from 'libs/wallet';
import { MutableRefObject, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  useGetBalanceOf,
  useGetTokenUsdPrice,
  useGetXvsBridgeFeeEstimation,
  useGetXvsBridgeMintStatus,
  useGetXvsBridgeStatus,
} from 'clients/api';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { ChainId, Token } from 'types';
import {
  convertDollarsToCents,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

interface UseBridgeFormInput {
  toChainIdRef: MutableRefObject<ChainId | undefined>;
  walletBalanceTokens: BigNumber;
  xvs: Token | undefined;
}

const useBridgeForm = ({ toChainIdRef, walletBalanceTokens, xvs }: UseBridgeFormInput) => {
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

  const toChainId = toChainIdRef.current;

  const { data: getXvsBridgeStatusData } = useGetXvsBridgeStatus(
    {
      toChainId: toChainId!,
    },
    {
      enabled: !!toChainId,
    },
  );

  const { data: getXvsBridgeMintStatusData } = useGetXvsBridgeMintStatus(
    {
      destinationChainId: toChainIdRef.current!,
    },
    {
      enabled: toChainIdRef.current !== undefined,
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
      const xvsAmountMantissa = xvs
        ? convertTokensToMantissa({
            value: xvsAmountTokens,
            token: xvs,
          })
        : BigNumber(0);
      const xvsAmountUsd = xvsAmountTokens.times(xvsPriceUsd);
      const isSingleTransactionLimitExceeded = xvsAmountUsd.gt(maxSingleTransactionLimitUsd);
      const maxSingleTransactionLimitTokens = maxSingleTransactionLimitUsd.dividedBy(xvsPriceUsd);
      const doesNotHaveEnoughXvs = walletBalanceTokens.lt(xvsAmountTokens);

      // checks the if the XVS mint cap in the destination was or is going to be reached if the user tries
      // to bridge the informed amount of tokens
      const isMintCapReached = getXvsBridgeMintStatusData
        ? getXvsBridgeMintStatusData.minterToCapMantissa.lte(
            getXvsBridgeMintStatusData.bridgeAmountMintedMantissa.plus(xvsAmountMantissa),
          )
        : false;

      if (getXvsBridgeMintStatusData && isMintCapReached) {
        const { bridgeAmountMintedMantissa, minterToCapMantissa } = getXvsBridgeMintStatusData;
        // calculate how much XVS is still available to be minted
        const mintableXvsAmountMantissa = minterToCapMantissa.gt(bridgeAmountMintedMantissa)
          ? minterToCapMantissa.minus(bridgeAmountMintedMantissa)
          : BigNumber(0);
        const mintableXvsAmountTokens = convertMantissaToTokens({
          value: mintableXvsAmountMantissa,
          token: xvs,
        });
        const readableAmountTokens = formatTokensToReadableValue({
          value: mintableXvsAmountTokens,
          token: xvs,
        });
        ctx.addIssue({
          code: 'custom',
          message: t('bridgePage.errors.mintCapReached.message', {
            readableAmountTokens,
          }),
          path: ['mintCapReached'],
        });
      }

      // checks if this bridge transaction is going to exceed the single transaction limit in USD
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

      // checks if this bridge transaction is going to exceed the global daily limit in USD
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

      if (doesNotHaveEnoughXvs) {
        ctx.addIssue({
          code: 'custom',
          message: t('bridgePage.errors.doesNotHaveEnoughXvs', {
            tokenSymbol: xvs?.symbol,
          }),
          path: ['doesNotHaveEnoughXvs'],
        });
      }
    },
    [
      dailyLimitResetTimestamp,
      getXvsBridgeMintStatusData,
      maxSingleTransactionLimitUsd,
      t,
      remainingXvsDailyLimitTokens,
      remainingXvsDailyLimitUsd,
      walletBalanceTokens,
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

  const { fromChainId: formFromChainId, toChainId: formToChainId, amountTokens } = form.watch();

  // save toChainId in a ref so it can be fed into the form's validation
  toChainIdRef.current = formToChainId;

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

  // the chain can be changed either by the form or the header dropdown
  // we have to ensure a BNB chain is either the origin or the destination of a bridge operation
  useEffect(() => {
    const previousFromChainId = formFromChainId;
    if (chainId !== formFromChainId) {
      form.setValue('fromChainId', chainId);
      if (chainId !== ChainId.BSC_MAINNET && chainId !== ChainId.BSC_TESTNET) {
        const bscChainId = chains.find(c => c.nativeCurrency.name === 'BNB')?.id as ChainId;
        form.setValue('toChainId', bscChainId);
      } else {
        form.setValue('toChainId', previousFromChainId);
      }
    }
  }, [chainId, form, formFromChainId, formToChainId]);

  return { ...form, amountMantissa };
};

export default useBridgeForm;
