import { TertiaryButton, cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { useGetBalanceOf, useGetPendleSwapQuote, useGetTokenUsdPrice } from 'clients/api';
import { usePendlePtVault } from 'clients/api';
import { ButtonGroup, LabeledInlineContent, NoticeInfo, Slider, TokenTextField } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type AnyVault, type PendleVault, VaultManager } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatDateToUtc,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { useNow } from 'hooks/useNow';
import { PendleConvertDetails } from './PendleConvertDetails';
import { SubmitButton } from './SubmitButton';
import type { Approval } from './SubmitButton/types';
import useForm, { type FormValues } from './useForm';

type ActionMode = 'deposit' | 'withdraw' | 'redeemAtMaturity';

export interface PositionTabProps {
  vault: AnyVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: React.FC<PositionTabProps> = ({
  vault,
  initialMode = 'deposit',
  onClose,
}) => {
  const { t } = useTranslation();
  const now = useNow();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const hasMatured =
    'maturityTimestampMs' in vault &&
    vault.maturityTimestampMs &&
    now.getTime() > vault.maturityTimestampMs;

  // --- Action mode ---
  const forceActionMode = useMemo(() => {
    // Always display withdraw (redeemAtMaturity) after pendle maturity date
    if (vault.manager === VaultManager.Pendle && hasMatured) {
      return 'redeemAtMaturity';
    }

    return undefined;
  }, [vault, hasMatured]);

  const [actionMode, setActionMode] = useState<ActionMode>(
    forceActionMode ? forceActionMode : initialMode,
  );
  useEffect(() => {
    if (forceActionMode) {
      setActionMode(forceActionMode);
    }
  }, [forceActionMode]);

  const isStake = actionMode === 'deposit';

  const handleActionModeChange = (index: number) => {
    setActionMode(index === 0 ? 'deposit' : 'withdraw');
  };

  // --- Form state ---
  const initialFormValues: FormValues = useMemo(
    () => ({ tokenAmount: '', fromToken: isStake ? vault.rewardToken : vault.stakedToken }),
    [isStake, vault.rewardToken, vault.stakedToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when wallet disconnects or action mode changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [accountAddress, initialFormValues]);

  const { data: priceUsdData } = useGetTokenUsdPrice({ token: formValues.fromToken });

  // --- Swap quote ---
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const debouncedInputAmountTokens = useDebounceValue(formValues.tokenAmount || 0);
  const inputAmountBN = new BigNumber(debouncedInputAmountTokens);

  const toToken = isStake ? vault.stakedToken : vault.rewardToken;

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetPendleSwapQuote(
    {
      fromToken: formValues.fromToken,
      toToken,
      amountTokens: inputAmountBN,
      slippagePercentage:
        actionMode === 'redeemAtMaturity' ? 0 : userSlippageTolerancePercentage / 100,
    },
    { enabled: inputAmountBN.isGreaterThan(0) },
  );

  // --- Token approval ---
  const { address: pendlePtVaultAddress } = useGetContractAddress({ name: 'PendlePtVault' });
  const spenderAddress = isStake && pendlePtVaultAddress ? pendlePtVaultAddress : undefined;

  const { isTokenApproved: isFromTokenApproved, isApproveTokenLoading: isApproveFromTokenLoading } =
    useTokenApproval({
      token: formValues.fromToken,
      spenderAddress,
      accountAddress,
    });

  const approval = ((): Approval | undefined => {
    if (!isStake && pendlePtVaultAddress) {
      return {
        type: 'delegate',
        delegateeAddress: pendlePtVaultAddress,
        poolComptrollerContractAddress: (vault as PendleVault).poolComptrollerContractAddress,
      };
    }
    return spenderAddress &&
      Array.isArray(getSwapQuoteData?.requiredApprovals) &&
      getSwapQuoteData.requiredApprovals.length > 0 &&
      !isFromTokenApproved
      ? {
          type: 'token',
          token: formValues.fromToken,
          spenderAddress,
        }
      : undefined;
  })();

  // --- Balance ---
  // Derived from tokenBalances (same source as SelectTokenTextField), following SupplyForm pattern
  const balanceToken = formValues.fromToken;
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: balanceToken,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const balanceTokenAmount = useMemo(() => {
    if (isBalanceLoading || !balanceData) return undefined;

    return convertMantissaToTokens({
      value: balanceData.balanceMantissa,
      token: balanceToken,
    });
  }, [balanceToken, balanceData, isBalanceLoading]);

  const userStakedAmount = convertMantissaToTokens({
    value: vault.userStakedMantissa ?? new BigNumber(0),
    token: vault.stakedToken,
  });

  const readableUserStaked = formatTokensToReadableValue({
    value: userStakedAmount,
    token: vault.stakedToken,
  });

  const availableTokens = (isStake ? balanceTokenAmount : userStakedAmount) ?? new BigNumber(0);

  const readableAvailable = formatTokensToReadableValue({
    value: availableTokens,
    token: isStake ? balanceToken : vault.stakedToken,
  });

  // --- Vault action ---
  const { mutateAsync: pendleVaultMutation, isPending: isSubmitting } = usePendlePtVault({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
    isNative: formValues.fromToken.isNative,
  });

  const handleOnSubmit = async () => {
    if (!getSwapQuoteData) return;

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(formValues.tokenAmount),
      token: isStake ? formValues.fromToken : (vault as PendleVault).vToken, // Withdraw requires vToken amount as input instead
    });

    await pendleVaultMutation({
      swapQuote: getSwapQuoteData,
      type: actionMode,
      fromToken: formValues.fromToken,
      toToken,
      amountToken: amountMantissa,
      vToken: 'vToken' in vault ? vault.vToken : undefined,
    });

    onClose?.();
  };

  // --- Form validation ---
  const { handleSubmit, isFormValid, formError } = useForm({
    onSubmit: handleOnSubmit,
    formValues,
    setFormValues,
    swapQuoteErrorCode: getSwapQuoteError?.code,
    availableTokens,
    token: balanceToken,
  });

  // --- Derived display values ---
  const connectWalletMessage = t('vault.modals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  const maturityDateUtc =
    'maturityTimestampMs' in vault
      ? formatDateToUtc(vault.maturityTimestampMs, { formatStr: 'MMM dd yyyy HH:mm' })
      : undefined;
  const formattedMaturityDate = maturityDateUtc ? `${maturityDateUtc} UTC` : PLACEHOLDER_KEY;

  const estDiffAmount = getSwapQuoteData?.estimatedReceivedTokensMantissa
    ? convertMantissaToTokens({
        value: getSwapQuoteData.estimatedReceivedTokensMantissa,
        token: toToken,
      }).minus(formValues.tokenAmount)
    : undefined;
  const estDiff = estDiffAmount
    ? formatTokensToReadableValue({
        value: isStake ? estDiffAmount : estDiffAmount.negated(),
        token: toToken,
      })
    : undefined;

  // --- Slider ---
  const sliderPercentage =
    availableTokens.isGreaterThan(0) && Number(formValues.tokenAmount) > 0
      ? Math.min(
          100,
          new BigNumber(formValues.tokenAmount)
            .multipliedBy(100)
            .div(availableTokens)
            .dp(1)
            .toNumber(),
        )
      : 0;

  const handleSliderChange = (percentage: number) => {
    const tokenAmount = availableTokens
      .multipliedBy(percentage)
      .div(100)
      .dp(balanceToken.decimals)
      .toFixed();
    setFormValues(current => ({ ...current, tokenAmount }));
  };

  const handleMaxButtonClick = () => {
    setFormValues(current => ({ ...current, tokenAmount: availableTokens.toFixed() }));
  };

  // --- Submit state ---
  const disableInput =
    !isUserConnected || isSubmitting || isApproveFromTokenLoading || isBalanceLoading;
  const disableSubmit = !isFormValid || isSubmitting || isGetSwapQuoteLoading || !getSwapQuoteData;

  const actionLabel = (() => {
    if (actionMode === 'deposit') return t('vault.modals.stake');
    if (actionMode === 'withdraw') return t('vault.modals.withdraw');
    return t('vault.modals.claim');
  })();

  // When wallet is disconnected, show minimal view
  if (!accountAddress) {
    return (
      <div className="space-y-4">
        <LabeledInlineContent
          label={t('vault.modals.effectiveFixedApr')}
          tooltip={
            vault.manager === VaultManager.Pendle
              ? t('vault.modals.effectiveFixedAprPendleTooltip')
              : undefined
          }
        >
          <span className="text-b1s text-green">
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </span>
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('vault.modals.maturityDate')}
          tooltip={
            vault.manager === VaultManager.Pendle
              ? t('vault.modals.maturityDatePendleTooltip')
              : undefined
          }
        >
          <span className="text-b1s text-white">{formattedMaturityDate}</span>
        </LabeledInlineContent>

        <ConnectWallet analyticVariant="vault_pendle_modal" />

        <NoticeInfo description={connectWalletMessage} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Stake / Withdraw toggle */}
        {!forceActionMode && (
          <div className="py-2">
            <ButtonGroup
              buttonLabels={[t('vault.modals.stake'), t('vault.modals.withdraw')]}
              activeButtonIndex={isStake ? 0 : 1}
              onButtonClick={handleActionModeChange}
              fullWidth
            />
          </div>
        )}

        <div>
          {/* Amount input */}
          <TokenTextField
            token={balanceToken}
            value={formValues.tokenAmount}
            onChange={tokenAmount => setFormValues(curr => ({ ...curr, tokenAmount }))}
            disabled={disableInput}
            topRightAdornment={
              <div className="flex justify-end items-center gap-2 text-b1r text-light-grey">
                {priceUsdData && formValues.tokenAmount
                  ? `≈ ${formatCentsToReadableValue({
                      value: new BigNumber(formValues.tokenAmount)
                        .times(priceUsdData.tokenPriceUsd)
                        .shiftedBy(2),
                    })}`
                  : PLACEHOLDER_KEY}
                <TertiaryButton
                  size="xs"
                  className="bg-transparent border-dark-blue-hover"
                  disabled={disableInput}
                  onClick={handleMaxButtonClick}
                >
                  {t('vault.modals.max')}
                </TertiaryButton>
              </div>
            }
            hasError={!!formError?.message && Number(formValues.tokenAmount) > 0}
            description={
              !isSubmitting && formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
            label={actionLabel}
          />
        </div>

        {/* Available balance */}
        <LabeledInlineContent label={t('vault.modals.available')}>
          <span className="text-b1s text-white">{readableAvailable}</span>
        </LabeledInlineContent>

        {/* Slider */}
        <div className="space-y-2">
          <Slider
            value={sliderPercentage}
            onChange={handleSliderChange}
            min={0}
            max={100}
            step={1}
            disabled={availableTokens.lte(0) || isSubmitting}
          />
          <div className="flex justify-between">
            <span className="text-b2r text-grey">0%</span>
            <span className="text-b2r text-grey">100%</span>
          </div>
        </div>

        {/* Current Staked */}
        <LabeledInlineContent
          label={t('vault.modals.currentStaked')}
          tooltip={t('vault.modals.currentStakedTooltip')}
        >
          <span className="text-b1s text-white">{readableUserStaked}</span>
        </LabeledInlineContent>

        {/* Convert details (Pendle only) */}
        {vault.manager === VaultManager.Pendle && (
          <PendleConvertDetails
            fromToken={formValues.fromToken}
            toToken={toToken}
            slippagePercentage={userSlippageTolerancePercentage}
            swapQuote={getSwapQuoteData}
          />
        )}

        {/* Effective Fixed APR (stake mode only) */}
        {isStake && (
          <LabeledInlineContent
            label={t('vault.modals.effectiveFixedApr')}
            tooltip={t('vault.modals.effectiveFixedAprPendleTooltip')}
          >
            <span className="text-b1s text-green">
              {formatPercentageToReadableValue(vault.stakingAprPercentage)}
            </span>
          </LabeledInlineContent>
        )}

        {/* Est. Yield (stake) or Est. Penalty (withdraw) */}
        {actionMode !== 'redeemAtMaturity' && (
          <LabeledInlineContent
            label={isStake ? t('vault.modals.estYield') : t('vault.modals.estPenalty')}
          >
            <span className="text-b1s text-white">
              {estDiff ? `≈ ${estDiff}` : PLACEHOLDER_KEY}
            </span>
          </LabeledInlineContent>
        )}

        {/* Maturity Date */}
        <LabeledInlineContent
          label={t('vault.modals.maturityDate')}
          tooltip={
            vault.manager === VaultManager.Pendle
              ? t('vault.modals.maturityDatePendleTooltip')
              : undefined
          }
        >
          <span className="text-b1s text-white">{formattedMaturityDate}</span>
        </LabeledInlineContent>

        {/* Submit button */}
        <ConnectWallet
          className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
          analyticVariant="vault_pendle_modal"
        >
          <SubmitButton
            approval={approval}
            label={isFormValid ? actionLabel : t('vault.modals.submitButtonDisabledLabel')}
            isFormValid={isFormValid}
            isLoading={isGetSwapQuoteLoading || isSubmitting}
            disabled={disableSubmit}
          />

          {actionMode !== 'redeemAtMaturity' && (
            <SwapDetails
              fromToken={formValues.fromToken}
              toToken={toToken}
              priceImpactPercentage={getSwapQuoteData?.priceImpactPercentage}
            />
          )}
        </ConnectWallet>

        {/* Disclaimer notice */}
        {vault.manager === VaultManager.Pendle && (
          <NoticeInfo description={t('vault.modals.maturityPendleDisclaimer')} />
        )}
      </div>
    </form>
  );
};

export default PositionTab;
