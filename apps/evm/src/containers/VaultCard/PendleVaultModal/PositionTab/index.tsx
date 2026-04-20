import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import {
  AvailableBalance,
  ButtonGroup,
  LabeledInlineContent,
  NoticeInfo,
  Slider,
  TokenTextField,
} from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { SwapDetails } from 'containers/SwapDetails';
import { useTranslation } from 'libs/translations';
import { type PendleVault, VaultManager } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { SwitchChain } from 'containers/SwitchChain';
import { PendleConvertDetails } from './PendleConvertDetails';
import { SubmitButton } from './SubmitButton';
import { type ActionMode, usePositionTabData } from './usePositionTabData';

const PENDLE_SITE =
  'https://app.pendle.finance/trade/dashboard/overview/positions?timeframe=allTime';

export interface PositionTabProps {
  vault: PendleVault;
  initialMode?: ActionMode;
  onClose?: () => void;
}

// TODO: refactor with TransactionForm component

export const PositionTab: React.FC<PositionTabProps> = ({ vault, initialMode, onClose }) => {
  const { t, Trans } = useTranslation();

  const {
    actionMode,
    isStake,
    formValues,
    forceActionMode,
    hasMatured,
    accountAddress,
    isUserConnected,
    toToken,
    fromTokenPriceCents,
    userStakedTokens,
    availableTokens,
    getSwapQuoteData,
    isGetSwapQuoteLoading,
    userSlippageTolerancePercentage,
    handleSubmit,
    isFormValid,
    formError,
    approval,
    sliderPercentage,
    disableInput,
    disableSubmit,
    isSubmitting,
    handleAmountChange,
    handleSliderChange,
    handleMaxButtonClick,
    handleActionModeChange,
  } = usePositionTabData({ vault, initialMode, onClose });

  // --- Derived display values ---
  const formattedMaturityDate = vault.maturityDate
    ? t('vault.modals.textualWithTime', { date: vault.maturityDate })
    : PLACEHOLDER_KEY;

  const readableUserStaked = formatTokensToReadableValue({
    value: userStakedTokens,
    token: vault.rewardToken,
    maxDecimalPlaces: isStake ? undefined : 8,
  });

  const readableLimit = formatTokensToReadableValue({
    value: availableTokens,
    token: formValues.fromToken,
    maxDecimalPlaces: isStake ? undefined : 8,
  });

  let estimatedReceivedTokens: BigNumber | undefined;

  if (getSwapQuoteData?.estimatedReceivedTokensMantissa) {
    estimatedReceivedTokens = convertMantissaToTokens({
      value: getSwapQuoteData.estimatedReceivedTokensMantissa,
      token: toToken,
    });
  }

  const estDiffAmount = estimatedReceivedTokens?.minus(formValues.tokenAmount);

  let estDiffAmountReadable = PLACEHOLDER_KEY;

  if (actionMode === 'redeemAtMaturity') {
    estDiffAmountReadable = formatTokensToReadableValue({
      value: new BigNumber(0),
      token: toToken,
    });
  }

  if (actionMode !== 'redeemAtMaturity' && estDiffAmount) {
    estDiffAmountReadable = `≈ ${formatTokensToReadableValue({
      value: isStake ? estDiffAmount : estDiffAmount.negated(),
      token: toToken,
    })}`;
  }

  let actionLabel = t('vault.modals.claim');

  if (actionMode === 'deposit') {
    actionLabel = t('vault.modals.deposit');
  }

  if (actionMode === 'withdraw' || actionMode === 'redeemAtMaturity') {
    actionLabel = t('vault.modals.withdraw');
  }

  const connectWalletMessage = t('vault.modals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  // --- Disconnected state ---
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

  // --- Connected state ---
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {!forceActionMode && (
          <div className="py-2">
            <ButtonGroup
              buttonLabels={[t('vault.modals.deposit'), t('vault.modals.withdraw')]}
              activeButtonIndex={isStake ? 0 : 1}
              onButtonClick={handleActionModeChange}
              fullWidth
            />
          </div>
        )}

        <div>
          <TokenTextField
            token={formValues.fromToken}
            value={formValues.tokenAmount}
            tokenPriceCents={fromTokenPriceCents.toNumber()}
            onChange={handleAmountChange}
            disabled={disableInput}
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

        <AvailableBalance readableBalance={readableLimit} onClick={handleMaxButtonClick} />

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
          {readableUserStaked}
        </LabeledInlineContent>

        {vault.manager === VaultManager.Pendle && actionMode !== 'redeemAtMaturity' && (
          <PendleConvertDetails
            fromToken={formValues.fromToken}
            toToken={toToken}
            slippagePercentage={userSlippageTolerancePercentage}
            swapQuote={getSwapQuoteData}
          />
        )}

        {isStake && (
          <LabeledInlineContent
            label={t('vault.modals.effectiveFixedApr')}
            tooltip={t('vault.modals.effectiveFixedAprPendleTooltip')}
          >
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </LabeledInlineContent>
        )}

        <LabeledInlineContent
          label={isStake ? t('vault.modals.estYield') : t('vault.modals.estPenalty')}
        >
          {estDiffAmountReadable}
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('vault.modals.maturityDate')}
          tooltip={
            vault.manager === VaultManager.Pendle
              ? t('vault.modals.maturityDatePendleTooltip')
              : undefined
          }
        >
          {formattedMaturityDate}
        </LabeledInlineContent>

        <ConnectWallet
          className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
          analyticVariant="vault_pendle_modal"
        >
          <SwitchChain>
            <SubmitButton
              approval={approval}
              label={actionLabel}
              isFormValid={isFormValid}
              isLoading={isGetSwapQuoteLoading || isSubmitting}
              disabled={disableSubmit}
            />
          </SwitchChain>

          {actionMode !== 'redeemAtMaturity' && (
            <SwapDetails
              fromToken={formValues.fromToken}
              toToken={toToken}
              priceImpactPercentage={getSwapQuoteData?.priceImpactPercentage}
            />
          )}
        </ConnectWallet>

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
