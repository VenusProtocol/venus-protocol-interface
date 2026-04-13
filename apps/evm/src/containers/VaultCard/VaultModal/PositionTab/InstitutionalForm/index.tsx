import { TertiaryButton, cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import {
  Checkbox,
  LabeledInlineContent,
  NoticeInfo,
  PrimaryButton,
  Slider,
  TokenTextField,
} from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConnectWallet } from 'containers/ConnectWallet';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { SubmitButton } from '../SubmitButton';
import { useInstitutionalPositionTabData } from './useInstitutionalPositionTabData';

const CEFFU_TCS_URL = 'https://www.ceffu.com/legal/terms-of-service';

export interface InstitutionalFormProps {
  vault: InstitutionalVault;
  onClose?: () => void;
}

export const InstitutionalForm: React.FC<InstitutionalFormProps> = ({ vault, onClose }) => {
  const { t, Trans } = useTranslation();

  const {
    displayMode,
    formValues,
    accountAddress,
    isUserConnected,
    tcsAccepted,
    setTcsAccepted,
    userStakedTokens,
    maxRedeemTokens,
    availableTokens,
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
  } = useInstitutionalPositionTabData({ vault, onClose });

  // --- Shared display values ---
  const readableUserStaked = formatTokensToReadableValue({
    value: userStakedTokens,
    token: vault.stakedToken,
  });

  const readableApr = formatPercentageToReadableValue(vault.stakingAprPercentage);

  const formattedMaturityDate = vault.maturityDate
    ? t('vault.modals.textualWithTime', { date: vault.maturityDate })
    : PLACEHOLDER_KEY;

  const totalYieldTokens = maxRedeemTokens?.minus(userStakedTokens);
  const readableTotalYield = formatTokensToReadableValue({
    value: totalYieldTokens,
    token: vault.stakedToken,
  });

  // --- Shared info rows used by claim, info, and refund ---
  const infoRows = (
    <>
      <LabeledInlineContent
        label={t('vault.modals.currentStaked')}
        tooltip={t('vault.modals.currentStakedTooltip')}
      >
        <span className="text-b1s text-white">{readableUserStaked}</span>
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('vault.modals.effectiveFixedApr')}
        tooltip={t('vault.modals.effectiveFixedAprPendleTooltip')}
      >
        <span className="text-b1s text-green">{readableApr}</span>
      </LabeledInlineContent>

      <LabeledInlineContent
        label={t('vault.modals.totalYield')}
        tooltip={t('vault.modals.totalYieldTooltip')}
      >
        <span className="text-b1s text-white">{readableTotalYield}</span>
      </LabeledInlineContent>
    </>
  );

  // --- Earning / Pending / Repaying: info view ---
  if (displayMode === 'info') {
    return (
      <div className="space-y-4">
        {infoRows}

        <LabeledInlineContent
          label={t('vault.modals.maturityDate')}
          tooltip={t('vault.modals.maturityDateTooltip')}
        >
          <span className="text-b1s text-white">{formattedMaturityDate}</span>
        </LabeledInlineContent>

        <NoticeInfo description={t('vault.modals.depositsPausedNotice')} />
      </div>
    );
  }

  // --- Claim status: info rows + Withdraw button ---
  if (displayMode === 'claim') {
    return (
      <div className="space-y-4">
        {infoRows}

        <LabeledInlineContent
          label={t('vault.modals.maturityDate')}
          tooltip={t('vault.modals.maturityDateTooltip')}
        >
          <span className="text-b1s text-white">{formattedMaturityDate}</span>
        </LabeledInlineContent>

        <ConnectWallet analyticVariant="vault_institutional_modal">
          <PrimaryButton
            className="w-full"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={disableSubmit}
          >
            {t('vault.modals.withdraw')}
          </PrimaryButton>
        </ConnectWallet>
      </div>
    );
  }

  // --- Refund status: info rows (no maturity date) + Refund button ---
  if (displayMode === 'refund') {
    return (
      <div className="space-y-4">
        {infoRows}

        <ConnectWallet analyticVariant="vault_institutional_modal">
          <PrimaryButton
            className="w-full"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={disableSubmit}
          >
            {t('vault.modals.refund')}
          </PrimaryButton>
        </ConnectWallet>
      </div>
    );
  }

  // --- Deposit status: full form ---
  const formattedOpenEndDate = vault.openEndDate
    ? t('vault.modals.textualWithTime', { date: vault.openEndDate })
    : PLACEHOLDER_KEY;

  const readableAvailable = formatTokensToReadableValue({
    value: availableTokens,
    token: vault.stakedToken,
  });

  const tokenAmountBN = new BigNumber(formValues.tokenAmount);
  const inputAmountTokens = tokenAmountBN.isNaN() ? new BigNumber(0) : tokenAmountBN;

  let readableInputUsdValue = PLACEHOLDER_KEY;

  if (!tokenAmountBN.isNaN() && vault.stakedTokenPriceCents) {
    readableInputUsdValue = `≈ ${formatCentsToReadableValue({
      value: tokenAmountBN.times(vault.stakedTokenPriceCents),
    })}`;
  }

  const projectedStakedTokens = userStakedTokens.plus(inputAmountTokens);

  const readableProjectedStaked = formatTokensToReadableValue({
    value: projectedStakedTokens,
    token: vault.stakedToken,
  });

  const lockingDays = vault.lockingPeriodMs
    ? Math.round(vault.lockingPeriodMs / (1000 * 60 * 60 * 24))
    : 0;

  const connectWalletMessage = t('vault.modals.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  // --- Deposit: disconnected state ---
  if (!accountAddress) {
    return (
      <div className="space-y-4">
        <LabeledInlineContent label={t('vault.modals.effectiveFixedApr')}>
          <span className="text-b1s text-green">{readableApr}</span>
        </LabeledInlineContent>

        {vault.openEndDate && (
          <LabeledInlineContent
            label={t('vault.modals.depositWindowEnds')}
            tooltip={t('vault.modals.depositWindowEndsTooltip')}
          >
            <span className="text-b1s text-white">{formattedOpenEndDate}</span>
          </LabeledInlineContent>
        )}

        <ConnectWallet analyticVariant="vault_institutional_modal" />

        <NoticeInfo description={connectWalletMessage} />
      </div>
    );
  }

  // --- Deposit: connected state ---
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <TokenTextField
            token={formValues.fromToken}
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
            hasError={!!formError?.message && Number(formValues.tokenAmount) > 0}
            description={
              formError?.message ? <p className="text-red">{formError.message}</p> : undefined
            }
            label={t('vault.modals.stake')}
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
          label={t('vault.modals.currentStaked')}
          tooltip={t('vault.modals.currentStakedTooltip')}
        >
          <span className="text-b1s text-white">
            {readableUserStaked}
            <span className="text-grey mx-1">→</span>
            {readableProjectedStaked}
          </span>
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('vault.modals.effectiveFixedApr')}
          tooltip={t('vault.modals.effectiveFixedAprPendleTooltip')}
        >
          <span className="text-b1s text-green">{readableApr}</span>
        </LabeledInlineContent>

        {vault.openEndDate && (
          <LabeledInlineContent
            label={t('vault.modals.depositWindowEnds')}
            tooltip={t('vault.modals.depositWindowEndsTooltip')}
          >
            <span className="text-b1s text-white">{formattedOpenEndDate}</span>
          </LabeledInlineContent>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            value={tcsAccepted}
            onChange={e => setTcsAccepted(e.target.checked)}
            size="md"
          />
          <span className="text-b1r text-grey">
            <Trans
              i18nKey="vault.modals.institutionalTcsAgreement"
              components={{
                Link: <Link href={CEFFU_TCS_URL} target="_blank" />,
              }}
            />
          </span>
        </label>

        <ConnectWallet
          className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
          analyticVariant="vault_institutional_modal"
        >
          <SubmitButton
            approval={approval}
            label={
              isFormValid && tcsAccepted
                ? t('vault.modals.stake')
                : t('vault.modals.submitButtonDisabledLabel')
            }
            isFormValid={isFormValid && tcsAccepted}
            isLoading={isSubmitting}
            disabled={disableSubmit}
          />
        </ConnectWallet>

        <NoticeInfo
          description={t('vault.modals.institutionalDisclaimer', {
            count: lockingDays,
          })}
        />
      </div>
    </form>
  );
};
