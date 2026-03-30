import { TertiaryButton, cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
  useGetBalanceOf,
  useGetPendleSwapQuote,
  useGetTokenUsdPrice,
  useGetVTokenBalance,
  usePendlePtVaultDeposit,
  usePendlePtVaultWithdraw,
  useWithdraw,
} from 'clients/api';
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
import { type PendleVault, VaultManager } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { Link } from 'containers/Link';
import { useNow } from 'hooks/useNow';
import { PendleConvertDetails } from './PendleConvertDetails';
import { SubmitButton } from './SubmitButton';
import type { Approval } from './SubmitButton/types';
import useForm, { type FormValues } from './useForm';

type ActionMode = 'deposit' | 'withdraw' | 'redeemAtMaturity';
const PENDLE_SITE =
  'https://app.pendle.finance/trade/dashboard/overview/positions?timeframe=allTime';
export interface PositionTabProps {
  vault: PendleVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: React.FC<PositionTabProps> = ({
  vault,
  initialMode = 'deposit',
  onClose,
}) => {
  const { t, Trans } = useTranslation();
  const now = useNow();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const hasMatured = vault.maturityDate && now.getTime() > vault.maturityDate.getTime();

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: also watch for wallet connect/disconnect
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [accountAddress, initialFormValues]);

  const { data: priceUsdData } = useGetTokenUsdPrice({ token: formValues.fromToken });

  // --- Swap quote ---
  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const debouncedInputAmountTokens = useDebounceValue(formValues.tokenAmount || 0);
  const amountTokens = new BigNumber(debouncedInputAmountTokens);

  const toToken = isStake ? vault.stakedToken : vault.rewardToken;

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetPendleSwapQuote(
    {
      fromToken: formValues.fromToken,
      toToken,
      amountTokens,
      slippagePercentage:
        actionMode === 'redeemAtMaturity' ? 0 : userSlippageTolerancePercentage / 100,
    },
    { enabled: amountTokens.isGreaterThan(0) && actionMode !== 'redeemAtMaturity' },
  );

  // --- Token approval ---
  const { address: pendlePtVaultAddress } = useGetContractAddress({ name: 'PendlePtVault' });
  const spenderAddress = isStake && pendlePtVaultAddress ? pendlePtVaultAddress : undefined;

  const {
    isTokenApproved: isFromTokenApproved,
    isApproveTokenLoading: isApproveFromTokenLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress,
    accountAddress,
  });

  const approval = ((): Approval | undefined => {
    if (!isStake && pendlePtVaultAddress) {
      return {
        type: 'delegate',
        delegateeAddress: pendlePtVaultAddress,
        poolComptrollerContractAddress: vault.poolComptrollerContractAddress,
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

  const { data: getVTokenBalanceData } = useGetVTokenBalance(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      vTokenAddress: vault.asset.vToken.address,
    },
    {
      enabled: !!accountAddress && actionMode === 'redeemAtMaturity',
    },
  );

  const balanceTokens = useMemo(() => {
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

  // Determine the amount of tokens the user can supply, taking the supply cap, their wallet
  // balance and spending limit in consideration
  const limitTokens = useMemo(() => {
    // If user is using swap, we fill the input with the user's wallet balance as we don't have a
    // way to know in advance exactly how much of the fromToken they can supply to
    let amountTokens = new BigNumber(balanceTokens || 0);

    // If user has set a spending limit for fromToken, then we take it in consideration
    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      amountTokens = BigNumber.min(amountTokens, fromTokenWalletSpendingLimitTokens);
    }
    const marginWithSupplyCapTokens = vault.asset.supplyCapTokens.isEqualTo(0)
      ? new BigNumber(0)
      : vault.asset.supplyCapTokens.minus(vault.asset.supplyBalanceTokens);
    amountTokens = BigNumber.min(amountTokens, marginWithSupplyCapTokens);

    return amountTokens;
  }, [
    vault.asset.supplyBalanceTokens,
    balanceTokens,
    fromTokenWalletSpendingLimitTokens,
    vault.asset.supplyCapTokens,
  ]);

  const availableTokens = (isStake ? limitTokens : userStakedAmount) ?? new BigNumber(0);

  const readableAvailable = formatTokensToReadableValue({
    value: availableTokens,
    token: isStake ? balanceToken : vault.stakedToken,
  });

  // --- Vault action ---
  const { mutateAsync: deposit, isPending: isDepositLoading } = usePendlePtVaultDeposit({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
    isNative: formValues.fromToken.isNative,
  });

  const { mutateAsync: withdraw, isPending: isWithdrawLoading } = usePendlePtVaultWithdraw({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
  });

  const { mutateAsync: withdrawAfterMaturity, isPending: isWithdrawAfterMaturityLoading } =
    useWithdraw();

  const isSubmitting = isDepositLoading || isWithdrawLoading || isWithdrawAfterMaturityLoading;

  const handleOnSubmit = async () => {
    // Use Withdraw from Core pool.
    if (actionMode === 'redeemAtMaturity') {
      const withdrawFull = formValues.tokenAmount === availableTokens.toFixed();
      await withdrawAfterMaturity({
        poolName: vault.poolName,
        poolComptrollerContractAddress: vault.poolComptrollerContractAddress,
        vToken: vault.asset.vToken,
        withdrawFullSupply: withdrawFull,
        unwrap: formValues.fromToken.isNative,
        amountMantissa:
          withdrawFull && getVTokenBalanceData?.balanceMantissa
            ? getVTokenBalanceData.balanceMantissa
            : convertTokensToMantissa({
                value: new BigNumber(formValues.tokenAmount),
                token: formValues.fromToken,
              }),
      });
    } else if (getSwapQuoteData) {
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(formValues.tokenAmount),
        token: isStake ? formValues.fromToken : vault.asset.vToken, // Withdraw requires vToken amount as input instead
      });

      const params = {
        swapQuote: getSwapQuoteData,
        type: actionMode,
        fromToken: formValues.fromToken,
        toToken,
        amountMantissa,
        vToken: vault.asset.vToken,
      };

      const submitFunc = actionMode === 'deposit' ? deposit : withdraw;

      await submitFunc(params);
    }

    onClose?.();
  };

  // --- Form validation ---
  const { handleSubmit, isFormValid, formError } = useForm({
    onSubmit: handleOnSubmit,
    formValues,
    setFormValues,
    swapQuoteError: getSwapQuoteError ?? undefined,
    availableTokens,
    balanceTokens,
    token: balanceToken,
  });

  // --- Derived display values ---
  const connectWalletMessage = t('vault.modals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  const formattedMaturityDate = vault.maturityDate
    ? t('vault.modals.textualWithTime', {
        date: vault.maturityDate,
      })
    : PLACEHOLDER_KEY;

  const estDiffAmountReadable = (() => {
    if (actionMode === 'redeemAtMaturity') {
      return formatTokensToReadableValue({
        value: new BigNumber(0),
        token: toToken,
      });
    }

    if (!getSwapQuoteData?.estimatedReceivedTokensMantissa) return PLACEHOLDER_KEY;

    const diffAmount = convertMantissaToTokens({
      value: getSwapQuoteData.estimatedReceivedTokensMantissa,
      token: toToken,
    }).minus(formValues.tokenAmount);

    return `≈ ${isStake ? diffAmount : diffAmount.negated()}`;
  })();

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
  const disableSubmit =
    !isFormValid ||
    isSubmitting ||
    isGetSwapQuoteLoading ||
    (actionMode !== 'redeemAtMaturity' && !getSwapQuoteData);

  const actionLabel = (() => {
    if (actionMode === 'deposit') return t('vault.modals.stake');
    if (actionMode === 'withdraw' || actionMode === 'redeemAtMaturity')
      return t('vault.modals.withdraw');
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
            hasError={
              !!formError?.message && !isGetSwapQuoteLoading && Number(formValues.tokenAmount) > 0
            }
            description={
              !isGetSwapQuoteLoading && !!formError?.message ? (
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
        {vault.manager === VaultManager.Pendle && actionMode !== 'redeemAtMaturity' && (
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
        <LabeledInlineContent
          label={isStake ? t('vault.modals.estYield') : t('vault.modals.estPenalty')}
        >
          <span className="text-b1s text-white">{estDiffAmountReadable}</span>
        </LabeledInlineContent>

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
          <NoticeInfo
            description={
              hasMatured ? (
                <Trans
                  i18nKey="vault.modals.afterMaturityPendleDisclaimer"
                  components={{
                    Link: <Link href={PENDLE_SITE} />,
                  }}
                />
              ) : (
                t('vault.modals.maturityPendleDisclaimer')
              )
            }
          />
        )}
      </div>
    </form>
  );
};
