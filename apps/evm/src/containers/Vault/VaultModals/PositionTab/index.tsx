import { PrimaryButton, cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { useGetBalanceOf, useGetPendleSwapQuote } from 'clients/api';
import { ButtonGroup, LabeledInlineContent, NoticeInfo, Slider, TokenTextField } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { type AnyVault, VaultManager } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatDateToUtc,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { usePendlePtVault } from 'clients/api/mutations/usePendlePtVault';
import { SwapDetails } from 'containers/SwapDetails';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { PendleConvertDetails } from './PendleConvertDetails';
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

  const [actionMode, setActionMode] = useState<ActionMode>(initialMode);

  const isStake = actionMode === 'deposit';

  // For stake: balance of the underlying token (future: use different token per mode when Pendle API is ready)
  const balanceToken = vault.rewardToken;

  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: balanceToken,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const availableMantissa = balanceData?.balanceMantissa ?? new BigNumber(0);

  const availableTokens = convertMantissaToTokens({
    value: availableMantissa,
    token: balanceToken,
  });

  const readableAvailable = useConvertMantissaToReadableTokenString({
    value: availableMantissa,
    token: balanceToken,
  });

  const readableUserStaked = useConvertMantissaToReadableTokenString({
    value: vault.userStakedMantissa ?? new BigNumber(0),
    token: vault.stakedToken,
  });

  const maturityDateUtc =
    'maturityDate' in vault
      ? formatDateToUtc(vault.maturityDate, { formatStr: 'MMM dd yyyy HH:mm' })
      : undefined;

  const formattedMaturityDate = maturityDateUtc ? `${maturityDateUtc} UTC` : PLACEHOLDER_KEY;

  const connectWalletMessage = t('vaultModals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  // Form state (follows SupplyForm pattern)
  const initialFormValues: FormValues = useMemo(() => ({ amountTokens: '' }), []);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when wallet disconnects
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

  // Reset form when action mode changes
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  const _debouncedInputAmountTokens = useDebounceValue(formValues.amountTokens || 0);
  const debouncedInputAmountTokens = new BigNumber(_debouncedInputAmountTokens || 0);

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const {
    data: getSwapQuoteData,
    error: getSwapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetPendleSwapQuote(
    {
      fromToken: vault.rewardToken,
      toToken: vault.stakedToken,
      amount: debouncedInputAmountTokens,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled: debouncedInputAmountTokens.isGreaterThan(0),
    },
  );

  const { mutateAsync: pendleVaultAction, isPending: isSubmitting } = usePendlePtVault({
    pendleMarketAddress: getSwapQuoteData?.pendleMarketAddress ?? NULL_ADDRESS,
    isNative: false,
  });

  const handleOnSubmit = async () => {
    if (!getSwapQuoteData) return;

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(formValues.amountTokens),
      token: vault.stakedToken,
    });

    return pendleVaultAction({
      swapQuote: getSwapQuoteData,
      type: actionMode,
      stakedToken: vault.stakedToken,
      rewardToken: vault.rewardToken,
      amountToken: amountMantissa,
    });
  };

  const estYield = getSwapQuoteData?.estReceiveMantissa
    ? formatTokensToReadableValue({
        value: convertMantissaToTokens({
          value: getSwapQuoteData.estReceiveMantissa,
          token: vault.stakedToken,
        }).minus(formValues.amountTokens),
        token: vault.stakedToken,
      })
    : undefined;

  const { handleSubmit, isFormValid, formError } = useForm({
    onSubmit: handleOnSubmit,
    formValues,
    setFormValues,
    swapQuoteErrorCode: getSwapQuoteError?.code,
    availableTokens,
    token: balanceToken,
  });

  // Slider: derive percentage from form value (BoostForm pattern)
  const sliderPercentage =
    availableTokens.isGreaterThan(0) && Number(formValues.amountTokens) > 0
      ? Math.min(
          100,
          new BigNumber(formValues.amountTokens)
            .multipliedBy(100)
            .div(availableTokens)
            .dp(1)
            .toNumber(),
        )
      : 0;

  const handleSliderChange = (percentage: number) => {
    const amountTokens = availableTokens
      .multipliedBy(percentage)
      .div(100)
      .dp(balanceToken.decimals)
      .toFixed();
    setFormValues(current => ({ ...current, amountTokens }));
  };

  const handleActionModeChange = (index: number) => {
    setActionMode(index === 0 ? 'deposit' : 'withdraw');
  };

  const handleMaxButtonClick = () => {
    setFormValues(current => ({
      ...current,
      amountTokens: availableTokens.toFixed(),
    }));
  };

  const disableInput = isBalanceLoading || isSubmitting;
  const disableSubmit =
    isBalanceLoading || !isFormValid || isSubmitting || isGetSwapQuoteLoading || !getSwapQuoteData;

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
          <TokenTextField
            token={balanceToken}
            value={formValues.amountTokens}
            onChange={amountTokens => setFormValues(curr => ({ ...curr, amountTokens }))}
            disabled={disableInput}
            rightMaxButton={{
              label: t('vaultModals.max'),
              onClick: handleMaxButtonClick,
            }}
            hasError={!!formError?.message && Number(formValues.amountTokens) > 0}
            description={
              !isSubmitting && formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
            label={isStake ? t('vaultModals.stakeLabel') : t('vaultModals.withdraw')}
          />
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
            fromToken={isStake ? vault.rewardToken : vault.stakedToken}
            toToken={isStake ? vault.stakedToken : vault.rewardToken}
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
          <span className="text-b1s text-white">{estYield ?? PLACEHOLDER_KEY}</span>
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
          <PrimaryButton
            type="submit"
            loading={isGetSwapQuoteLoading || isSubmitting}
            disabled={disableSubmit}
            className="w-full"
          >
            {isFormValid ? submitButtonLabel : t('vaultModals.submitButtonDisabledLabel')}
          </PrimaryButton>

          {vault && (
            <SwapDetails
              fromToken={vault.rewardToken}
              toToken={vault.stakedToken}
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
