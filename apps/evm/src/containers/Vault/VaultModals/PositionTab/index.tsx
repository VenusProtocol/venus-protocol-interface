import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { useGetPendleSwapQuote } from 'clients/api';
import { type PendlePtVaultInput, usePendlePtVault } from 'clients/api/mutations/usePendlePtVault';
import {
  ButtonGroup,
  LabeledInlineContent,
  NoticeInfo,
  SelectTokenTextField,
  Slider,
  TokenTextField,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useGetOperationFormTokenBalances } from 'pages/Market/OperationForm/useGetOperationFormTokenBalances';
import { type AnyVault, type PendleVault, VaultManager } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatDateToUtc,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { PendleConvertDetails } from './PendleConvertDetails';
import { SubmitButton } from './SubmitButton';
import type { Approval } from './SubmitButton/types';
import useForm, { type FormValues } from './useForm';

type ActionMode = 'deposit' | 'withdraw';

export interface PositionTabProps {
  vault: AnyVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const PositionTab: React.FC<PositionTabProps> = ({ vault, initialMode = 'deposit' }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  // --- Action mode ---
  const [actionMode, setActionMode] = useState<ActionMode>(initialMode);
  const isStake = actionMode === 'deposit';

  const handleActionModeChange = (index: number) => {
    setActionMode(index === 0 ? 'deposit' : 'withdraw');
  };

  const initialFormValues: FormValues = useMemo(
    () => ({ tokenAmount: '', fromToken: isStake ? vault.rewardToken : vault.stakedToken }),
    [isStake, vault.rewardToken, vault.stakedToken],
  );

  // --- Form state ---
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when wallet disconnects or action mode changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [accountAddress, initialFormValues]);

  const readableUserStaked = useConvertMantissaToReadableTokenString({
    value: vault.userStakedMantissa ?? new BigNumber(0),
    token: vault.stakedToken,
  });

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
      amount: inputAmountBN,
      slippagePercentage: userSlippageTolerancePercentage / 100,
    },
    { enabled: inputAmountBN.isGreaterThan(0) },
  );

  // --- Token approval ---
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });

  const canUseSwap = isStake && isIntegratedSwapEnabled;

  const { address: pendlePtVaultAddress } = useGetContractAddress({ name: 'PendlePtVault' });
  const spenderAddress =
    isStake && canUseSwap && pendlePtVaultAddress ? pendlePtVaultAddress : undefined;

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
        poolComptrollerContractAddress: (vault as PendleVault).poolComptrollerAddress,
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

  const { tokenBalances } = useGetOperationFormTokenBalances({
    poolComptrollerContractAddress:
      'poolComptrollerAddress' in vault ? vault.poolComptrollerAddress : NULL_ADDRESS,
    accountAddress,
    underlyingToken: (vault as PendleVault).vToken.underlyingToken,
    isIntegratedSwapFeatureEnabled: canUseSwap,
    canWrapNativeToken: false, // TODO: TBC
    action: 'vault',
  });

  // --- Balance ---
  // Derived from tokenBalances (same source as SelectTokenTextField), following SupplyForm pattern
  const balanceToken = isStake ? formValues.fromToken : vault.stakedToken;
  const availableTokens = useMemo(() => {
    if (!isStake)
      return convertMantissaToTokens({
        value: vault.userStakedMantissa ?? new BigNumber(0),
        token: balanceToken,
      });

    const match = tokenBalances.find(item => areTokensEqual(item.token, formValues.fromToken));
    return match
      ? convertMantissaToTokens({ value: match.balanceMantissa, token: match.token })
      : new BigNumber(0);
  }, [isStake, tokenBalances, formValues.fromToken, balanceToken, vault.userStakedMantissa]);

  const readableAvailable = isStake
    ? formatTokensToReadableValue({
        value: availableTokens,
        token: balanceToken,
      })
    : readableUserStaked;

  // --- Vault action ---
  const { mutateAsync: pendleVaultAction, isPending: isSubmitting } = usePendlePtVault({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
    isNative: formValues.fromToken.isNative,
  });

  const handleOnSubmit = async () => {
    if (!getSwapQuoteData) return;

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(formValues.tokenAmount),
      token: isStake ? formValues.fromToken : (vault as PendleVault).vToken, // Withdraw requires vToken amount as input instead
    });

    const now = new Date().getTime();
    let type: PendlePtVaultInput['type'] = actionMode;

    if ('maturityDate' in vault && vault.maturityDate && now > vault.maturityDate && !isStake) {
      type = 'redeemAtMaturity';
    }

    return pendleVaultAction({
      swapQuote: getSwapQuoteData,
      type,
      fromToken: formValues.fromToken,
      toToken,
      amountToken: amountMantissa,
    });
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
  const connectWalletMessage = t('vaultModals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  const maturityDateUtc =
    'maturityDate' in vault
      ? formatDateToUtc(vault.maturityDate, { formatStr: 'MMM dd yyyy HH:mm' })
      : undefined;
  const formattedMaturityDate = maturityDateUtc ? `${maturityDateUtc} UTC` : PLACEHOLDER_KEY;

  const estDiffAmount = getSwapQuoteData?.estReceiveMantissa
    ? convertMantissaToTokens({
        value: getSwapQuoteData.estReceiveMantissa,
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
  const disableInput = !isUserConnected || isSubmitting || isApproveFromTokenLoading;
  const disableSubmit = !isFormValid || isSubmitting || isGetSwapQuoteLoading || !getSwapQuoteData;

  const submitButtonLabel = isStake
    ? t('vaultModals.submitStake')
    : t('vaultModals.submitWithdraw');

  // When wallet is disconnected, show minimal view
  if (!accountAddress) {
    return (
      <div className="space-y-4">
        <LabeledInlineContent
          label={t('vaultModals.effectiveFixedApr')}
          tooltip={t('vaultModals.effectiveFixedAprTooltip')}
        >
          <span className="text-b1s text-green">
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </span>
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('vaultModals.maturityDate')}
          tooltip={t('vaultModals.maturityDateTooltip')}
        >
          <span className="text-b1s text-white">{formattedMaturityDate}</span>
        </LabeledInlineContent>

        <NoticeInfo description={connectWalletMessage} />

        <ConnectWallet analyticVariant="vault_pendle_modal" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Stake / Withdraw toggle */}
        <div className="py-2">
          <ButtonGroup
            buttonLabels={[t('vaultModals.stake'), t('vaultModals.withdraw')]}
            activeButtonIndex={isStake ? 0 : 1}
            onButtonClick={handleActionModeChange}
            fullWidth
          />
        </div>

        <div>
          {/* Amount input */}
          {canUseSwap ? (
            <SelectTokenTextField
              selectedToken={formValues.fromToken}
              value={formValues.tokenAmount}
              hasError={!isSubmitting && !!formError && Number(formValues.tokenAmount) > 0}
              disabled={disableInput}
              onChange={tokenAmount => {
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  tokenAmount,
                }));
              }}
              onChangeSelectedToken={fromToken =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  tokenAmount: initialFormValues.tokenAmount,
                  fromToken,
                }))
              }
              rightMaxButton={{
                label: t('operationForm.rightMaxButtonLabel'),
                onClick: handleMaxButtonClick,
              }}
              tokenBalances={tokenBalances}
              description={
                !isSubmitting && !!formError?.message ? (
                  <p className="text-red">{formError.message}</p>
                ) : undefined
              }
            />
          ) : (
            <TokenTextField
              token={balanceToken}
              value={formValues.tokenAmount}
              onChange={tokenAmount => setFormValues(curr => ({ ...curr, tokenAmount }))}
              disabled={disableInput}
              rightMaxButton={{
                label: t('vaultModals.max'),
                onClick: handleMaxButtonClick,
              }}
              hasError={!!formError?.message && Number(formValues.tokenAmount) > 0}
              description={
                !isSubmitting && formError?.message ? (
                  <p className="text-red">{formError.message}</p>
                ) : undefined
              }
              label={isStake ? t('vaultModals.stakeLabel') : t('vaultModals.withdraw')}
            />
          )}
        </div>

        {/* Available balance */}
        <LabeledInlineContent label={t('vaultModals.available')}>
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
          label={t('vaultModals.currentStaked')}
          tooltip={t('vaultModals.currentStakedTooltip')}
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
            label={t('vaultModals.effectiveFixedApr')}
            tooltip={t('vaultModals.effectiveFixedAprTooltip')}
          >
            <span className="text-b1s text-green">
              {formatPercentageToReadableValue(vault.stakingAprPercentage)}
            </span>
          </LabeledInlineContent>
        )}

        {/* Est. Yield (stake) or Est. Penalty (withdraw) */}
        <LabeledInlineContent
          label={isStake ? t('vaultModals.estYield') : t('vaultModals.estPenalty')}
        >
          <span className="text-b1s text-white">{estDiff ? `≈ ${estDiff}` : PLACEHOLDER_KEY}</span>
        </LabeledInlineContent>

        {/* Maturity Date */}
        <LabeledInlineContent
          label={t('vaultModals.maturityDate')}
          tooltip={t('vaultModals.maturityDateTooltip')}
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
            label={isFormValid ? submitButtonLabel : t('vaultModals.submitButtonDisabledLabel')}
            isFormValid={isFormValid}
            isLoading={isGetSwapQuoteLoading || isSubmitting}
            disabled={disableSubmit}
          />

          {canUseSwap && (
            <SwapDetails
              fromToken={formValues.fromToken}
              toToken={toToken}
              priceImpactPercentage={getSwapQuoteData?.priceImpactPercentage}
            />
          )}
        </ConnectWallet>

        {/* Disclaimer notice */}
        <NoticeInfo description={t('vaultModals.maturityDisclaimer')} />
      </div>
    </form>
  );
};

export default PositionTab;
