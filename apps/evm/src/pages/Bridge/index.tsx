import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useRef } from 'react';
import { Controller } from 'react-hook-form';
import type { Chain } from 'viem';

import { cn } from '@venusprotocol/ui';
import { useBridgeXvs, useGetBalanceOf, useGetXvsBridgeFeeEstimation } from 'clients/api';
import {
  ApproveTokenSteps,
  Card,
  Icon,
  LabeledInlineContent,
  Notice,
  Page,
  PrimaryButton,
  SpendingLimit,
  Spinner,
  TextButton,
  TokenTextField,
} from 'components';
import config from 'config';
import { NULL_ADDRESS } from 'constants/address';
import { VENUS_DOC_URL } from 'constants/production';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { SwitchChain } from 'containers/SwitchChain';
import { useChain } from 'hooks/useChain';
import useTokenApproval from 'hooks/useTokenApproval';
import { getContractAddress } from 'libs/contracts';
import { handleError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId, useSwitchChain } from 'libs/wallet';
import { ChainId } from 'types';
import { convertMantissaToTokens, formatTokensToReadableValue } from 'utilities';
import { ChainSelect, getOptionsFromChainsList } from './ChainSelect';
import { bridgeChains } from './constants';
import LayerZeroLogo from './layerZeroLogo.svg?react';
import TEST_IDS from './testIds';
import useBridgeForm from './useBridgeForm';

const BRIDGE_DOC_URL = `${VENUS_DOC_URL}/guides/xvs-bridge`;

const BridgePage: React.FC = () => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const { nativeToken } = useChain();
  const { switchChain } = useSwitchChain();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const xvs = useGetToken({
    symbol: 'XVS',
    chainId,
  });

  const bridgeContractAddress = useMemo(() => {
    switch (chainId) {
      case ChainId.BSC_MAINNET:
      case ChainId.BSC_TESTNET:
        return getContractAddress({ name: 'XVSProxyOFTSrc', chainId });
      default:
        return getContractAddress({ name: 'XVSProxyOFTDest', chainId });
    }
  }, [chainId]);

  const { data: getBalanceOfData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: xvs,
    },
    {
      enabled: !!accountAddress && !!xvs,
    },
  );

  const [walletBalanceTokens, readableWalletBalance] = useMemo(() => {
    const balanceTokens = convertMantissaToTokens({
      value: getBalanceOfData?.balanceMantissa || new BigNumber(0),
      token: xvs,
    });
    const readableBalance = formatTokensToReadableValue({
      value: balanceTokens,
      token: xvs,
    });
    return [balanceTokens, readableBalance];
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

  const toChainIdRef = useRef(bridgeChains.find(c => c.id !== chainId)?.id);

  const {
    control,
    handleSubmit,
    formState,
    getValues,
    watch,
    setValue,
    resetField,
    amountMantissa,
  } = useBridgeForm({
    toChainIdRef,
    walletBalanceTokens,
    xvs,
  });

  const { fromChainId, toChainId } = watch();

  const { data: getXvsBridgeFeeEstimationData } = useGetXvsBridgeFeeEstimation(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      destinationChain: toChainId,
      amountMantissa,
    },
    {
      enabled: !!accountAddress && amountMantissa > 0n,
    },
  );

  const [bridgeEstimatedFeeMantissa, bridgeEstimatedFeeTokens] = useMemo(() => {
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
          amountMantissa: new BigNumber(amountMantissa.toString()),
          destinationChainId: toChainId,
          nativeCurrencyFeeMantissa: bridgeEstimatedFeeMantissa,
        });
        resetField('amountTokens');
      } catch (error) {
        handleError({ error });
      }
    }
  };

  const errorLabel = useMemo(
    () =>
      // @ts-expect-error the custom error path is not inferred by the resolver
      formState.errors.amountTokens?.singleTransactionLimitExceeded?.message ||
      // @ts-expect-error the custom error path is not inferred by the resolver
      formState.errors.amountTokens?.dailyTransactionLimitExceeded?.message ||
      // @ts-expect-error the custom error path is not inferred by the resolver
      formState.errors.amountTokens?.mintCapReached?.message,
    [formState.errors.amountTokens],
  );

  const submitButtonLabel = useMemo(() => {
    if (isXvsApproved) {
      // @ts-expect-error the custom error path is not inferred by the resolver
      if (formState.errors.amountTokens?.singleTransactionLimitExceeded) {
        return t('bridgePage.errors.singleTransactionLimitExceeded.submitButton');
      }
      // @ts-expect-error the custom error path is not inferred by the resolver
      if (formState.errors.amountTokens?.dailyTransactionLimitExceeded) {
        return t('bridgePage.errors.dailyTransactionLimitExceeded.submitButton');
      }
      // @ts-expect-error the custom error path is not inferred by the resolver
      if (formState.errors.amountTokens?.doesNotHaveEnoughXvs) {
        return t('bridgePage.errors.doesNotHaveEnoughXvs', {
          tokenSymbol: xvs?.symbol,
        });
      }
      // @ts-expect-error the custom error path is not inferred by the resolver
      if (formState.errors.amountTokens?.mintCapReached) {
        return t('bridgePage.errors.mintCapReached.submitButton');
      }
      if (formState.errors.bridgeEstimatedFeeMantissa) {
        return t('bridgePage.errors.doesNotHaveEnoughNativeFunds', {
          tokenSymbol: nativeToken?.symbol,
        });
      }
      if (formState.isValid) {
        return t('bridgePage.submitButton.label.submit');
      }
    }

    return t('bridgePage.submitButton.label.enterValidAmount');
  }, [
    isXvsApproved,
    t,
    nativeToken,
    formState.errors.amountTokens,
    formState.errors.bridgeEstimatedFeeMantissa,
    formState.isValid,
    xvs,
  ]);

  // build the list of chains that can be selected
  const [fromChainIdOptions, toChainIdOptions] = useMemo(() => {
    const fromChains = getOptionsFromChainsList(
      bridgeChains.filter(c => c.id !== toChainId) as [Chain, ...Chain[]],
    );
    const otherChains = getOptionsFromChainsList(
      bridgeChains.filter(c => c.id !== fromChainId) as [Chain, ...Chain[]],
    );
    return [fromChains, otherChains];
  }, [fromChainId, toChainId]);

  if (!nativeToken || !xvs) {
    return <Spinner />;
  }

  const readableFee = formatTokensToReadableValue({
    token: nativeToken,
    value: bridgeEstimatedFeeTokens,
  });

  return (
    <Page indexWithSearchEngines={false}>
      <div className="mx-auto w-full space-y-6 md:max-w-[544px]">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="md:flex md:items-end md:justify-between md:gap-4 grow">
                <Controller
                  name="fromChainId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="w-full min-w-0 grow md:mb-0">
                      <ChainSelect
                        // When running in Safe Wallet app, it is responsible for the active chain
                        disabled={config.isSafeApp}
                        label={t('bridgePage.fromChainSelect.label')}
                        data-testid={TEST_IDS.fromChainIdSelect}
                        options={fromChainIdOptions}
                        {...field}
                        onChange={newChainId => {
                          handleChainFieldChange({
                            newFromChainId: newChainId as ChainId,
                          });
                        }}
                      />
                    </div>
                  )}
                />

                <TextButton
                  className="mx-auto mt-4 flex h-auto flex-none p-2 md:mt-0 md:mb-[6px]"
                  onClick={switchChains}
                  disabled={formState.isSubmitting || config.isSafeApp}
                  data-testid={TEST_IDS.switchChainsButton}
                >
                  <Icon
                    name={config.isSafeApp ? 'arrowRight' : 'convert'}
                    className="text-blue h-6 w-6 rotate-90 md:rotate-0"
                  />
                </TextButton>

                <Controller
                  name="toChainId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="w-full min-w-0 grow md:mb-0">
                      <ChainSelect
                        menuPosition="right"
                        label={t('bridgePage.toChainSelect.label')}
                        data-testid={TEST_IDS.toChainIdSelect}
                        options={toChainIdOptions}
                        {...field}
                        onChange={newChainId => {
                          handleChainFieldChange({
                            newToChainId: newChainId as ChainId,
                          });
                        }}
                      />
                    </div>
                  )}
                />
              </div>

              <Controller
                name="amountTokens"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TokenTextField
                    data-testid={TEST_IDS.tokenTextField}
                    token={xvs}
                    label={t('bridgePage.amountInput.label')}
                    hasError={fieldState.invalid}
                    rightMaxButton={{
                      label: t('bridgePage.amountInput.maxButtonLabel'),
                      onClick: () => {
                        setValue('amountTokens', walletBalanceTokens.toFixed(), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      },
                    }}
                    {...field}
                    disabled={field.disabled || isApproveXvsLoading || !accountAddress}
                  />
                )}
              />
            </div>

            <ConnectWallet
              className={cn('space-y-6', isUserConnected ? 'mt-4' : 'mt-6')}
              analyticVariant="bridge"
            >
              <div className="space-y-4">
                {errorLabel && (
                  <Notice variant="error" description={errorLabel} data-testid={TEST_IDS.notice} />
                )}

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

                <LabeledInlineContent
                  label={t('bridgePage.bridgeGasFee.label')}
                  tooltip={t('bridgePage.bridgeGasFee.tooltip')}
                >
                  {readableFee}
                </LabeledInlineContent>
              </div>

              <SwitchChain>
                <ApproveTokenSteps
                  token={xvs}
                  hideTokenEnablingStep={!formState.isDirty || !accountAddress}
                  isTokenApproved={isXvsApproved}
                  approveToken={approveXvs}
                  isApproveTokenLoading={isApproveXvsLoading}
                  isWalletSpendingLimitLoading={isXvsWalletSpendingLimitLoading}
                  secondStepButtonLabel={submitButtonLabel}
                >
                  <PrimaryButton
                    type="submit"
                    loading={formState.isSubmitting}
                    disabled={
                      !formState.isValid ||
                      formState.isSubmitting ||
                      isXvsWalletSpendingLimitLoading ||
                      isRevokeXvsWalletSpendingLimitLoading ||
                      !isXvsApproved
                    }
                    className="w-full"
                  >
                    {submitButtonLabel}
                  </PrimaryButton>
                </ApproveTokenSteps>
              </SwitchChain>
            </ConnectWallet>
          </form>
        </Card>

        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center">
            <span className="text-grey mr-1 text-sm">{t('bridgePage.footer.poweredBy')}</span>
            <LayerZeroLogo className="w-[80px]" />
          </div>

          <div className="bg-lightGrey h-5 w-px" />

          <Link href={BRIDGE_DOC_URL} className="flex items-center text-sm">
            {t('bridgePage.footer.bridgeDocLink')}

            <Icon name="open" className="ml-1 text-inherit" />
          </Link>
        </div>
      </div>
    </Page>
  );
};

export default BridgePage;
