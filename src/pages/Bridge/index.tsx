import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { fromUnixTime } from 'date-fns';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  useBridgeXvs,
  useGetBalanceOf,
  useGetTokenUsdPrice,
  useGetXvsBridgeFeeEstimation,
  useGetXvsBridgeStatus,
} from 'clients/api';
import {
  ApproveTokenSteps,
  Card,
  Icon,
  LabeledInlineContent,
  Notice,
  PrimaryButton,
  SpendingLimit,
  Spinner,
  TextButton,
  TokenTextField,
} from 'components';
import { Link } from 'containers/Link';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import useTokenApproval from 'hooks/useTokenApproval';
import {
  getXVSProxyOFTDestContractAddress,
  getXVSProxyOFTSrcContractAddress,
} from 'packages/contracts';
import { displayMutationError } from 'packages/errors';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import {
  chains,
  useAccountAddress,
  useAuthModal,
  useChainId,
  useSwitchChain,
} from 'packages/wallet';
import { ChainId } from 'types';
import {
  convertDollarsToCents,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { ChainSelect } from './ChainSelect';
import { ReactComponent as LayerZeroLogo } from './layerZeroLogo.svg';
import TEST_IDS from './testIds';

const BRIDGE_DOC_URL =
  'https://docs-v4.venus.io/technical-reference/reference-technical-articles/technical-doc-xvs-bridge';

const formSchema = z.object({
  doesNotHaveEnoughNativeFunds: z.boolean().refine((v: boolean) => !v),
  isDailyTransactionLimitExceeded: z.boolean().refine((v: boolean) => !v),
  isSingleTransactionLimitExceeded: z.boolean().refine((v: boolean) => !v),
  fromChainId: z.nativeEnum(ChainId),
  toChainId: z.nativeEnum(ChainId),
  amountTokens: z
    .string()
    .min(1)
    .refine((v: string) => !Number.isNaN(v)),
});

const BridgePage: React.FC = () => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { nativeToken } = useGetChainMetadata();
  const { switchChain } = useSwitchChain();
  const { openAuthModal } = useAuthModal();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;
  const xvs = useGetToken({
    symbol: 'XVS',
    chainId,
  });

  const { data: getTokenUsdPriceData } = useGetTokenUsdPrice(
    {
      token: xvs,
    },
    {
      enabled: !!xvs,
    },
  );

  const bridgeContractAddress = useMemo(() => {
    switch (chainId) {
      case ChainId.ETHEREUM:
      case ChainId.SEPOLIA:
        return getXVSProxyOFTDestContractAddress({ chainId });
      default:
        return getXVSProxyOFTSrcContractAddress({ chainId });
    }
  }, [chainId]);

  const { data: getBalanceOfData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: xvs,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { data: getBalanceOfNativeTokenData, isLoading: isLoadingGetBalanceOfNativeToken } =
    useGetBalanceOf(
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

  const [walletBalanceTokens, readableWalletBalance] = useMemo(() => {
    const balanceTokens = convertMantissaToTokens({
      value: getBalanceOfData?.balanceMantissa || new BigNumber(0),
      token: xvs,
    });
    const balanceRedable = formatTokensToReadableValue({
      value: balanceTokens,
      token: xvs,
    });
    return [balanceTokens, balanceRedable];
  }, [getBalanceOfData, xvs]);

  const {
    isTokenApproved: isXvsApproved,
    approveToken: approveXvs,
    isApproveTokenLoading: isApproveXvsLoading,
    isWalletSpendingLimitLoading: isXvsWalletSpendingLimitLoading,
    walletSpendingLimitTokens: xvsWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeXvsWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeXvsWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: xvs!,
    spenderAddress: bridgeContractAddress,
    accountAddress,
  });

  const defaultValues = useMemo(
    () => ({
      doesNotHaveEnoughNativeFunds: false,
      dailyTransactionLimitExceeded: false,
      isSingleTransactionLimitExceeded: false,
      fromChainId: chainId,
      toChainId: chains.find(chain => chain.id !== chainId)?.id as ChainId,
      amountTokens: undefined,
    }),
    [chainId],
  );

  const { control, handleSubmit, formState, getValues, watch, setValue } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    doesNotHaveEnoughNativeFunds,
    isDailyTransactionLimitExceeded,
    isSingleTransactionLimitExceeded,
    amountTokens,
    toChainId,
  } = watch();

  const { data: getXvsBridgeStatusData } = useGetXvsBridgeStatus({ toChainId });

  const [maxSingleTransactionLimitUsd, dailyLimitResetTimestamp] = useMemo(
    () => [
      getXvsBridgeStatusData?.maxSingleTransactionLimitUsd || new BigNumber(0),
      getXvsBridgeStatusData?.dailyLimitResetTimestamp || new BigNumber(0),
    ],
    [getXvsBridgeStatusData],
  );

  const amountMantissa = useDebounceValue(
    xvs
      ? convertTokensToMantissa({
          value: new BigNumber(amountTokens) || new BigNumber(0),
          token: xvs,
        })
      : new BigNumber(0),
  );

  const xvsAmountUsd = useMemo(() => {
    const xvsPriceDollars = getTokenUsdPriceData?.tokenPriceUsd || BigNumber(0);
    return xvsPriceDollars.times(amountTokens || BigNumber(0));
  }, [amountTokens, getTokenUsdPriceData]);

  const { data: getXvsBridgeFeeEstimationData } = useGetXvsBridgeFeeEstimation(
    {
      accountAddress: accountAddress || '',
      destinationChain: toChainId,
      amountMantissa,
    },
    {
      enabled: !!accountAddress && amountMantissa.gt(0),
    },
  );

  const [remainingXvsDailyLimitUsd, remainingXvsDailyLimitTokens] = useMemo(() => {
    if (getXvsBridgeStatusData && getTokenUsdPriceData) {
      const { totalTransferredLast24HourUsd, maxDailyLimitUsd } = getXvsBridgeStatusData;
      const remainingUsdValue = maxDailyLimitUsd.minus(totalTransferredLast24HourUsd);
      const xvsPriceUsd = getTokenUsdPriceData.tokenPriceUsd || new BigNumber(0);
      const remaningTokensAmount = !xvsPriceUsd.isZero()
        ? remainingUsdValue.dividedBy(xvsPriceUsd)
        : new BigNumber(0);
      return [remainingUsdValue, remaningTokensAmount];
    }

    return [new BigNumber(0), new BigNumber(0)];
  }, [getXvsBridgeStatusData, getTokenUsdPriceData]);

  const [bridgeEstimatedFeeMantissa, brigeEstimatedFeeTokens] = useMemo(() => {
    const feeMantissa = getXvsBridgeFeeEstimationData?.estimationFeeMantissa || new BigNumber(0);
    return [
      feeMantissa,
      convertMantissaToTokens({
        value: feeMantissa,
        token: nativeToken,
      }),
    ];
  }, [getXvsBridgeFeeEstimationData, nativeToken]);

  const handleChainFieldChange = useCallback(
    ({ newFromChainId, newToChainId }: { newFromChainId?: ChainId; newToChainId?: ChainId }) => {
      const formValues = getValues();

      if (newFromChainId && newToChainId) {
        switchChain({
          chainId: newFromChainId,
          callback: () => {
            setValue('fromChainId', newFromChainId);
            setValue('toChainId', newToChainId);
          },
        });
        return;
      }

      if (newFromChainId) {
        switchChain({
          chainId: newFromChainId,
          callback: () => {
            setValue('fromChainId', newFromChainId);

            if (formValues.toChainId === newFromChainId) {
              setValue('toChainId', formValues.fromChainId);
            }
          },
        });
        return;
      }

      if (newToChainId && formValues.fromChainId === newToChainId) {
        switchChain({
          chainId: formValues.toChainId,
          callback: () => {
            setValue('fromChainId', formValues.toChainId);
            setValue('toChainId', newToChainId);
          },
        });
        return;
      }

      if (newToChainId) {
        setValue('toChainId', newToChainId);
      }
    },
    [setValue, switchChain, getValues],
  );

  // check if there is enough native token to pay the estimated fee
  useEffect(() => {
    const val =
      bridgeEstimatedFeeMantissa.gt(0) &&
      nativeTokenBalanceMantissa.lte(bridgeEstimatedFeeMantissa);

    setValue('doesNotHaveEnoughNativeFunds', val, { shouldValidate: true });
  }, [bridgeEstimatedFeeMantissa, nativeTokenBalanceMantissa, setValue]);

  // check if amount of XVS informed by the user is over the max single transaction limit in USD
  useEffect(() => {
    const val =
      !!getXvsBridgeStatusData &&
      xvsAmountUsd.gt(getXvsBridgeStatusData.maxSingleTransactionLimitUsd);

    setValue('isSingleTransactionLimitExceeded', val, { shouldValidate: true });
  }, [getXvsBridgeStatusData, setValue, xvsAmountUsd]);

  // check if the global daily limit of XVS transferred was reached
  useEffect(() => {
    const val = xvsAmountUsd.gt(remainingXvsDailyLimitUsd);

    setValue('isDailyTransactionLimitExceeded', val, { shouldValidate: true });
  }, [remainingXvsDailyLimitUsd, setValue, xvsAmountUsd]);

  const switchChains = useCallback(() => {
    const formValues = getValues();

    handleChainFieldChange({
      newFromChainId: formValues.toChainId,
      newToChainId: formValues.fromChainId,
    });
  }, [getValues, handleChainFieldChange]);
  const { mutateAsync: bridgeXvs } = useBridgeXvs();

  const onSubmit = async () => {
    if (accountAddress) {
      try {
        await bridgeXvs({
          accountAddress,
          amountMantissa,
          destinationChainId: toChainId,
          nativeCurrencyFeeMantissa: bridgeEstimatedFeeMantissa,
        });
      } catch (error) {
        displayMutationError({ error });
      }
    }
  };

  const errorLabel = useMemo(() => {
    if (isSingleTransactionLimitExceeded) {
      const xvsPriceUsd = getTokenUsdPriceData?.tokenPriceUsd || new BigNumber(0);
      const maxSingleTransactionLimitTokens = maxSingleTransactionLimitUsd.dividedBy(xvsPriceUsd);
      const readableAmountTokens = formatTokensToReadableValue({
        value: maxSingleTransactionLimitTokens,
        token: xvs,
      });
      const readableAmountUsd = formatCentsToReadableValue({
        value: convertDollarsToCents(maxSingleTransactionLimitUsd),
      });
      return t('bridgePage.errors.singleTransactionLimitExceeded.message', {
        readableAmountTokens,
        readableAmountUsd,
      });
    }
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
      return t('bridgePage.errors.dailyTransactionLimitExceeded.message', {
        readableAmountTokens,
        readableAmountUsd,
        date,
      });
    }

    return undefined;
  }, [
    t,
    isDailyTransactionLimitExceeded,
    isSingleTransactionLimitExceeded,
    getTokenUsdPriceData,
    dailyLimitResetTimestamp,
    maxSingleTransactionLimitUsd,
    remainingXvsDailyLimitTokens,
    remainingXvsDailyLimitUsd,
    xvs,
  ]);

  const submitButtonLabel = useMemo(() => {
    if (isSingleTransactionLimitExceeded) {
      return t('bridgePage.errors.singleTransactionLimitExceeded.submitButton');
    }
    if (isDailyTransactionLimitExceeded) {
      return t('bridgePage.errors.dailyTransactionLimitExceeded.submitButton');
    }
    if (doesNotHaveEnoughNativeFunds) {
      return t('bridgePage.errors.doesNotHaveEnoughNativeFunds', {
        tokenSymbol: nativeToken?.symbol,
      });
    }
    if (formState.isValid) {
      return t('bridgePage.submitButton.label.submit');
    }

    return t('bridgePage.submitButton.label.enterValidAmount');
  }, [
    t,
    nativeToken,
    doesNotHaveEnoughNativeFunds,
    formState.isValid,
    isDailyTransactionLimitExceeded,
    isSingleTransactionLimitExceeded,
  ]);

  if (!nativeToken || !xvs) {
    return <Spinner />;
  }

  const readableFee = formatTokensToReadableValue({
    token: nativeToken,
    value: brigeEstimatedFeeTokens,
  });

  return (
    <div className="mx-auto w-full space-y-6 md:max-w-[544px]">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 md:flex md:items-end md:justify-between md:space-x-4">
            <Controller
              name="fromChainId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ChainSelect
                  label={t('bridgePage.fromChainSelect.label')}
                  className="mb-4 w-full min-w-0 grow md:mb-0"
                  testId={TEST_IDS.fromChainIdSelect}
                  {...field}
                  onChange={newChainId => {
                    handleChainFieldChange({
                      newFromChainId: newChainId as ChainId,
                    });
                  }}
                />
              )}
            />

            <TextButton
              className="mx-auto mb-2 flex h-auto flex-none p-2 md:mb-[3px]"
              onClick={switchChains}
              disabled={formState.isSubmitting}
              data-testid={TEST_IDS.switchChainsButton}
            >
              <Icon name="convert" className="h-6 w-6 rotate-90 text-blue md:rotate-0" />
            </TextButton>

            <Controller
              name="toChainId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <ChainSelect
                  menuPosition="right"
                  className="w-full min-w-0 grow"
                  label={t('bridgePage.toChainSelect.label')}
                  testId={TEST_IDS.toChainIdSelect}
                  {...field}
                  onChange={newChainId => {
                    handleChainFieldChange({
                      newToChainId: newChainId as ChainId,
                    });
                  }}
                />
              )}
            />
          </div>

          <Controller
            name="amountTokens"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TokenTextField
                data-testid={TEST_IDS.tokenTextField}
                token={xvs}
                label={t('bridgePage.amountInput.label')}
                className="mb-3"
                disabled={formState.isValid || isApproveXvsLoading || !!accountAddress}
                rightMaxButton={{
                  label: t('bridgePage.amountInput.maxButtonLabel'),
                  onClick: () => {
                    setValue('amountTokens', walletBalanceTokens.toFixed(), {
                      shouldValidate: true,
                    });
                  },
                }}
                {...field}
              />
            )}
          />

          {errorLabel && (
            <Notice
              className="mb-3"
              variant="error"
              description={errorLabel}
              data-testid={TEST_IDS.notice}
            />
          )}

          <div className="mb-6 space-y-3">
            <LabeledInlineContent label={t('bridgePage.walletBalance.label')}>
              {readableWalletBalance}
            </LabeledInlineContent>

            <SpendingLimit
              token={xvs}
              walletBalanceTokens={walletBalanceTokens}
              walletSpendingLimitTokens={xvsWalletSpendingLimitTokens}
              onRevoke={revokeXvsWalletSpendingLimit}
              isRevokeLoading={isRevokeXvsWalletSpendingLimitLoading}
            />
          </div>

          <LabeledInlineContent
            label={t('bridgePage.bridgeGasFee.label')}
            tooltip={t('bridgePage.bridgeGasFee.tooltip')}
            className="mb-10"
          >
            {readableFee}
          </LabeledInlineContent>

          <ApproveTokenSteps
            className="mt-10"
            token={xvs}
            hideTokenEnablingStep={!isUserConnected}
            isTokenApproved={isXvsApproved}
            approveToken={approveXvs}
            isApproveTokenLoading={isApproveXvsLoading}
            isWalletSpendingLimitLoading={isXvsWalletSpendingLimitLoading}
          >
            {isUserConnected ? (
              <PrimaryButton
                type="submit"
                loading={formState.isSubmitting}
                disabled={
                  !formState.isValid ||
                  formState.isSubmitting ||
                  isApproveXvsLoading ||
                  isXvsWalletSpendingLimitLoading ||
                  isRevokeXvsWalletSpendingLimitLoading ||
                  isLoadingGetBalanceOfNativeToken ||
                  !isXvsApproved
                }
                className="w-full"
              >
                {submitButtonLabel}
              </PrimaryButton>
            ) : (
              <PrimaryButton className="w-full" onClick={openAuthModal}>
                {t('bridgePage.connectWalletButton.label')}
              </PrimaryButton>
            )}
          </ApproveTokenSteps>
        </form>
      </Card>

      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center">
          <span className="mr-1 text-sm text-grey">{t('bridgePage.footer.poweredBy')}</span>
          <LayerZeroLogo className="w-[80px]" />
        </div>

        <div className="h-5 w-[1px] bg-lightGrey" />

        <Link href={BRIDGE_DOC_URL} className="flex items-center text-sm">
          {t('bridgePage.footer.bridgeDocLink')}

          <Icon name="open" className="ml-1 text-inherit" />
        </Link>
      </div>
    </div>
  );
};

export default BridgePage;
