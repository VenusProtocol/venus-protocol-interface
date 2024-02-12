import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useRef } from 'react';
import { Controller } from 'react-hook-form';

import { useBridgeXvs, useGetBalanceOf, useGetXvsBridgeFeeEstimation } from 'clients/api';
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
import { convertMantissaToTokens, formatTokensToReadableValue } from 'utilities';

import { ChainSelect, getOptionsFromChainsList } from './ChainSelect';
import { ReactComponent as LayerZeroLogo } from './layerZeroLogo.svg';
import TEST_IDS from './testIds';
import useBridgeForm from './useBridgeForm';

const BRIDGE_DOC_URL = 'https://docs-v4.venus.io/guides/xvs-bridge';

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

  const bridgeContractAddress = useMemo(() => {
    switch (chainId) {
      case ChainId.BSC_MAINNET:
      case ChainId.BSC_TESTNET:
        return getXVSProxyOFTSrcContractAddress({ chainId });
      default:
        return getXVSProxyOFTDestContractAddress({ chainId });
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

  const toChainIdRef = useRef(chains.find(c => c.id !== chainId)?.id);

  const { control, handleSubmit, formState, getValues, watch, setValue, reset, amountMantissa } =
    useBridgeForm({
      toChainIdRef,
      walletBalanceTokens,
      xvs,
    });

  const { toChainId } = watch();

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
          amountMantissa,
          destinationChainId: toChainId,
          nativeCurrencyFeeMantissa: bridgeEstimatedFeeMantissa,
        });
        reset({ amountTokens: '' });
      } catch (error) {
        displayMutationError({ error });
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

  // filter out which options to present when selecting chains
  // either BSC mainnet or BSC testnet must be the origin or the destination
  const [fromChainIdOptions, toChainIdOptions] = useMemo(() => {
    const bscChainListOptions = getOptionsFromChainsList(
      chains.filter(c => c.id === ChainId.BSC_MAINNET || c.id === ChainId.BSC_TESTNET),
    );
    const otherChainsListOptions = getOptionsFromChainsList(
      chains.filter(c => c.id !== ChainId.BSC_MAINNET && c.id !== ChainId.BSC_TESTNET),
    );
    if (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) {
      return [bscChainListOptions, otherChainsListOptions];
    }
    return [otherChainsListOptions, bscChainListOptions];
  }, [chainId]);

  if (!nativeToken || !xvs) {
    return <Spinner />;
  }

  const readableFee = formatTokensToReadableValue({
    token: nativeToken,
    value: bridgeEstimatedFeeTokens,
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
                  options={fromChainIdOptions}
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
                  options={toChainIdOptions}
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
            render={({ field, fieldState }) => (
              <TokenTextField
                data-testid={TEST_IDS.tokenTextField}
                token={xvs}
                label={t('bridgePage.amountInput.label')}
                className="mb-3"
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
            hideTokenEnablingStep={!formState.isDirty || !accountAddress}
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
                  isXvsWalletSpendingLimitLoading ||
                  isRevokeXvsWalletSpendingLimitLoading ||
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
