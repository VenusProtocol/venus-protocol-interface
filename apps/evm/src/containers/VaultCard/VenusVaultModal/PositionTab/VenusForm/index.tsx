import { TertiaryButton, cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import {
  ButtonGroup,
  LabeledInlineContent,
  NoticeInfo,
  Slider,
  TextButton,
  TokenTextField,
} from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useTranslation } from 'libs/translations';
import type { VenusVault } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { SubmitButton } from 'containers/VaultCard/VaultModal/PositionTab/SubmitButton';
import type { ActionMode } from 'containers/VaultCard/VaultModal/PositionTab/types';
import { WithdrawalRequestList } from 'containers/VaultCard/LegacyVaultModal/WithdrawTab/WithdrawFromVestingVaultForm/WithdrawalRequestList';
import { EstEarningsRow } from './EstEarningsRow';
import { PrimeInfo } from './PrimeInfo';
import { useVenusPositionTabData } from './useVenusPositionTabData';

export interface VenusFormProps {
  vault: VenusVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

export const VenusForm: React.FC<VenusFormProps> = ({ vault, initialMode, onClose }) => {
  const { t } = useTranslation();

  const {
    isDeposit,
    isXvsVault,
    formValues,
    accountAddress,
    isUserConnected,
    userStakedTokens,
    availableTokens,
    handleSubmit,
    isFormValid,
    formError,
    approval,
    primeTokenData,
    primeStatusData,
    shouldDisplayWithdrawalRequestList,
    setShouldDisplayWithdrawalRequestList,
    sliderPercentage,
    disableInput,
    disableSubmit,
    isSubmitting,
    handleAmountChange,
    handleSliderChange,
    handleMaxButtonClick,
    handleActionModeChange,
  } = useVenusPositionTabData({ vault, initialMode, onClose });

  // --- Derived display values ---
  const readableAvailable = formatTokensToReadableValue({
    value: availableTokens,
    token: vault.stakedToken,
  });

  const readableUserStaked = formatTokensToReadableValue({
    value: userStakedTokens,
    token: vault.stakedToken,
  });

  const tokenAmountBN = new BigNumber(formValues.tokenAmount);
  const hasInputAmount = !tokenAmountBN.isNaN() && tokenAmountBN.isGreaterThan(0);

  let readableInputUsdValue = PLACEHOLDER_KEY;

  if (vault.stakedTokenPriceCents && hasInputAmount) {
    readableInputUsdValue = `≈${formatCentsToReadableValue({
      value: tokenAmountBN.times(vault.stakedTokenPriceCents),
    })}`;
  }

  // Preview of "Currently deposited" after the transaction
  const previewStakedTokens = hasInputAmount
    ? isDeposit
      ? userStakedTokens.plus(tokenAmountBN)
      : userStakedTokens.minus(tokenAmountBN)
    : undefined;

  const readablePreviewStaked = previewStakedTokens
    ? formatTokensToReadableValue({
        value: BigNumber.max(previewStakedTokens, 0),
        token: vault.stakedToken,
      })
    : undefined;

  // After XVS request withdrawal, show request list
  if (shouldDisplayWithdrawalRequestList && isXvsVault && typeof vault.poolIndex === 'number') {
    return (
      <WithdrawalRequestList
        poolIndex={vault.poolIndex}
        stakedToken={vault.stakedToken}
        rewardToken={vault.rewardToken}
        onClose={() => onClose?.()}
        hideWithdrawalRequestList={() => setShouldDisplayWithdrawalRequestList(false)}
      />
    );
  }

  // --- Action labels ---
  let actionLabel: string;
  let disabledLabel: string;

  if (isDeposit) {
    actionLabel = t('vault.modals.deposit');
    disabledLabel = t('vault.modals.depositButtonDisabledLabel');
  } else if (isXvsVault) {
    actionLabel = t('requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonLabel');
    disabledLabel = t(
      'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonDisabledLabel',
    );
  } else {
    actionLabel = t('vault.modals.withdraw');
    disabledLabel = t('vault.modals.withdrawButtonDisabledLabel');
  }

  const inputLabel = isDeposit
    ? t('vault.modals.deposit')
    : isXvsVault
      ? t('requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.submitButtonLabel')
      : t('vault.modals.withdraw');

  const connectWalletMessage = t('vault.modals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  // --- Disconnected state ---
  if (!accountAddress) {
    return (
      <div className="space-y-4">
        <div className="py-2">
          <ButtonGroup
            buttonLabels={[t('vault.modals.deposit'), t('vault.modals.withdraw')]}
            activeButtonIndex={isDeposit ? 0 : 1}
            onButtonClick={handleActionModeChange}
            fullWidth
          />
        </div>

        <LabeledInlineContent label={t('vault.card.apr')}>
          <span className="text-b1s text-green">
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </span>
        </LabeledInlineContent>

        <ConnectWallet analyticVariant="vault_venus_modal" />

        <NoticeInfo description={connectWalletMessage} />
      </div>
    );
  }

  // --- Connected state ---
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="py-2">
          <ButtonGroup
            buttonLabels={[t('vault.modals.deposit'), t('vault.modals.withdraw')]}
            activeButtonIndex={isDeposit ? 0 : 1}
            onButtonClick={handleActionModeChange}
            fullWidth
          />
        </div>

        <div>
          <TokenTextField
            token={vault.stakedToken}
            value={formValues.tokenAmount}
            onChange={handleAmountChange}
            disabled={disableInput}
            topRightAdornment={
              <div className="flex justify-end items-center gap-2 text-b1r text-light-grey">
                {readableInputUsdValue}
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
            hasError={!!formError?.message && hasInputAmount}
            description={
              formError?.message && hasInputAmount ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
            label={inputLabel}
          />
        </div>

        <LabeledInlineContent label={t('vault.modals.available')}>
          <span className="text-b1s text-white">{readableAvailable}</span>
        </LabeledInlineContent>

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

        <LabeledInlineContent
          label={t('vault.modals.currentDeposited')}
          tooltip={t('vault.modals.currentDepositedTooltip')}
        >
          <span className="text-b1s text-white">
            {readablePreviewStaked
              ? `${readableUserStaked} → ${readablePreviewStaked}`
              : readableUserStaked}
          </span>
        </LabeledInlineContent>

        <EstEarningsRow
          token={vault.rewardToken}
          stakedTokens={userStakedTokens}
          previewStakedTokens={previewStakedTokens}
          stakingAprPercentage={vault.stakingAprPercentage}
        />

        {isXvsVault && !isDeposit && vault.lockingPeriodMs !== undefined && (
          <LabeledInlineContent
            label={t('vault.transactionForm.lockingPeriod.label')}
            tooltip={t('vault.venusModal.lockingPeriodTooltip')}
          >
            <span className="text-b1s text-white">
              {t('vault.transactionForm.lockingPeriod.duration', {
                date: new Date(Date.now() + vault.lockingPeriodMs),
              })}
            </span>
          </LabeledInlineContent>
        )}

        <LabeledInlineContent label={t('vault.card.apr')}>
          <span className="text-b1s text-green">
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </span>
        </LabeledInlineContent>

        {isXvsVault && (
          <PrimeInfo
            stakedToken={vault.stakedToken}
            userStakedTokens={userStakedTokens}
            primeTokenData={primeTokenData}
            primeStatusData={primeStatusData}
            poolIndex={vault.poolIndex}
          />
        )}

        <ConnectWallet
          className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
          analyticVariant="vault_venus_modal"
        >
          <SubmitButton
            approval={approval}
            label={isFormValid ? actionLabel : disabledLabel}
            isFormValid={isFormValid}
            isLoading={isSubmitting}
            disabled={disableSubmit}
          />
        </ConnectWallet>

        {isXvsVault && !isDeposit && (
          <TextButton
            onClick={() => setShouldDisplayWithdrawalRequestList(true)}
            className="mt-1 py-3 w-full"
          >
            {t(
              'requestWithdrawalFromVestingVaultForm.requestWithdrawalTab.displayWithdrawalRequestListButton',
            )}
          </TextButton>
        )}
      </div>
    </form>
  );
};
