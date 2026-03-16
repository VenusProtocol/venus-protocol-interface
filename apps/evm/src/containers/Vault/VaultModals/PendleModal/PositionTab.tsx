import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { useGetBalanceOf } from 'clients/api';
import { ButtonGroup, LabeledInlineContent, NoticeInfo, Slider } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { AmountForm } from 'containers/AmountForm';
import { ConnectWallet } from 'containers/ConnectWallet';
import { FormikSubmitButton, FormikTokenTextField } from 'containers/Form';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AnyVault } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatDateToUtc,
  formatPercentageToReadableValue,
} from 'utilities';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { ConvertDetails } from './ConvertDetails';

type ActionMode = 'stake' | 'withdraw';

export interface PositionTabProps {
  vault: AnyVault;
  initialMode?: ActionMode;
  onClose: () => void;
}

export const PositionTab: React.FC<PositionTabProps> = ({
  vault,
  initialMode = 'stake',
  onClose,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const [actionMode, setActionMode] = useState<ActionMode>(initialMode);

  const isStake = actionMode === 'stake';

  // For stake: balance of the underlying token (future: use different token per mode when Pendle API is ready)
  const balanceToken = vault.stakedToken;

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

  const handleActionModeChange = (index: number) => {
    setActionMode(index === 0 ? 'stake' : 'withdraw');
  };

  const handleSubmit = async (amountTokens: string) => {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(amountTokens),
      token: vault.stakedToken,
    });
    // Pendle-specific mutations will be wired here once the API layer is ready
    void amountMantissa;
    onClose();
  };

  const connectWalletMessage = t('pendleModal.connectWalletMessage', {
    tokenSymbol: vault.stakedToken.symbol,
  });

  // When wallet is disconnected, show minimal view
  if (!accountAddress) {
    return (
      <div className="space-y-4">
        <LabeledInlineContent
          label={t('pendleModal.effectiveFixedApr')}
          tooltip={t('pendleModal.effectiveFixedAprTooltip')}
        >
          <span className="text-b1s text-green">
            {formatPercentageToReadableValue(vault.stakingAprPercentage)}
          </span>
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('pendleModal.maturityDate')}
          tooltip={t('pendleModal.maturityDateTooltip')}
        >
          <span className="text-b1s text-white">{formattedMaturityDate}</span>
        </LabeledInlineContent>

        <NoticeInfo description={connectWalletMessage} />

        <ConnectWallet analyticVariant="vault_pendle_modal" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stake / Withdraw toggle */}
      <ButtonGroup
        buttonLabels={[t('pendleModal.stake'), t('pendleModal.withdraw')]}
        activeButtonIndex={isStake ? 0 : 1}
        onButtonClick={handleActionModeChange}
        fullWidth
      />

      <AmountForm onSubmit={handleSubmit} maxAmount={availableTokens.toFixed()}>
        {({ dirty, values, setFieldValue }) => {
          const parsedAmount = Number.parseFloat(values.amount || '0');
          const hasAmount = dirty && parsedAmount > 0;

          const sliderValue =
            availableTokens.gt(0) && hasAmount
              ? Math.min(100, Math.round((parsedAmount / availableTokens.toNumber()) * 100))
              : 0;

          const handleSliderChange = (newPercentage: number) => {
            if (availableTokens.gt(0)) {
              const newAmount = availableTokens.multipliedBy(newPercentage / 100);
              setFieldValue('amount', newAmount.toFixed(vault.stakedToken.decimals));
            }
          };

          return (
            <div className="space-y-4">
              {/* Amount input */}
              <div>
                <p className="text-b1r text-grey mb-2">
                  {isStake ? t('pendleModal.stakeLabel') : t('pendleModal.withdraw')}
                </p>
                <FormikTokenTextField
                  name="amount"
                  token={vault.stakedToken}
                  disabled={isBalanceLoading}
                  rightMaxButton={{
                    label: t('pendleModal.max'),
                    onClick: () => setFieldValue('amount', availableTokens.toFixed()),
                  }}
                  max={availableTokens.toFixed()}
                />
              </div>

              {/* Available balance */}
              <LabeledInlineContent label={t('pendleModal.available')}>
                <span className="text-b1s text-white">{readableAvailable}</span>
              </LabeledInlineContent>

              {/* Slider */}
              <div className="space-y-2">
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  min={0}
                  max={100}
                  step={1}
                  disabled={availableTokens.lte(0)}
                />
                <div className="flex justify-between">
                  <span className="text-b2r text-grey">0%</span>
                  <span className="text-b2r text-grey">100%</span>
                </div>
              </div>

              {/* Current Staked */}
              <LabeledInlineContent
                label={t('pendleModal.currentStaked')}
                tooltip={t('pendleModal.currentStakedTooltip')}
              >
                <span className="text-b1s text-white">{readableUserStaked}</span>
              </LabeledInlineContent>

              {/* Convert details (always visible; values are undefined when no amount entered) */}
              <ConvertDetails
                fromSymbol={isStake ? vault.rewardToken.symbol : vault.stakedToken.symbol}
                toSymbol={isStake ? vault.stakedToken.symbol : vault.rewardToken.symbol}
              />

              {/* Effective Fixed APR (stake mode) */}
              {isStake && (
                <LabeledInlineContent
                  label={t('pendleModal.effectiveFixedApr')}
                  tooltip={t('pendleModal.effectiveFixedAprTooltip')}
                >
                  <span className="text-b1s text-green">
                    {formatPercentageToReadableValue(vault.stakingAprPercentage)}
                  </span>
                </LabeledInlineContent>
              )}

              {/* Est. Yield (stake) or Est. Penalty (withdraw) */}
              <LabeledInlineContent
                label={isStake ? t('pendleModal.estYield') : t('pendleModal.estPenalty')}
              >
                <span className="text-b1s text-white">--</span>
              </LabeledInlineContent>

              {/* Maturity Date */}
              <LabeledInlineContent
                label={t('pendleModal.maturityDate')}
                tooltip={t('pendleModal.maturityDateTooltip')}
              >
                <span className="text-b1s text-white">{formattedMaturityDate}</span>
              </LabeledInlineContent>

              {/* Submit button */}
              <FormikSubmitButton
                className="w-full"
                enabledLabel={
                  isStake ? t('pendleModal.submitStake') : t('pendleModal.submitWithdraw')
                }
                disabledLabel={t('pendleModal.submitDisabled')}
              />

              {/* Disclaimer notice */}
              <NoticeInfo description={t('pendleModal.maturityDisclaimer')} />
            </div>
          );
        }}
      </AmountForm>
    </div>
  );
};

export default PositionTab;
