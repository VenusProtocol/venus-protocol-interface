/**
 * Temporary preview page for PendleModal UI development.
 * REMOVE after ui-qa-verify is complete.
 */
import BigNumber from 'bignumber.js';
import { useState } from 'react';

import { ButtonGroup, LabeledInlineContent, NoticeInfo, Slider } from 'components';
import { AmountForm } from 'containers/AmountForm';
import { FormikSubmitButton, FormikTokenTextField } from 'containers/Form';
import { PendleModal } from 'containers/Vault/VaultModals/PendleModal';
import { ConvertDetails } from 'containers/Vault/VaultModals/PendleModal/ConvertDetails';
import { useTranslation } from 'libs/translations';
import { formatPercentageToReadableValue } from 'utilities';
import type { Address } from 'viem';

// Minimal mock Token type
const mockPtToken = {
  address: '0x1234567890abcdef1234567890abcdef12345678' as Address,
  decimals: 18,
  symbol: 'Pt-clisBNBx',
  asset: 'https://venus.io/favicon.ico',
  isNative: false,
  tokenWrapped: undefined,
};

const mockBnbToken = {
  address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c' as Address,
  decimals: 18,
  symbol: 'BNB',
  asset: 'https://venus.io/favicon.ico',
  isNative: true,
  tokenWrapped: undefined,
};

export const mockVault = {
  stakedToken: mockPtToken,
  rewardToken: mockBnbToken,
  stakingAprPercentage: 0.1234,
  totalStakedMantissa: new BigNumber('5000000000000000000000'),
  dailyEmissionMantissa: new BigNumber('1000000000000000000'),
  isPaused: false,
  lockingPeriodMs: 90 * 24 * 60 * 60 * 1000,
  userStakedMantissa: new BigNumber('500000000000000000000'),
  poolIndex: undefined,
  userHasPendingWithdrawalsFromBeforeUpgrade: false,
};

// Standalone form preview: renders the Position tab form without wallet gate
const FormPreview: React.FC<{ mode: 'stake' | 'withdraw' }> = ({ mode }) => {
  const { t } = useTranslation();
  const isStake = mode === 'stake';
  const availableTokens = new BigNumber('15.1925');

  return (
    <div className="space-y-4 max-w-[520px] bg-cards rounded-2xl p-6">
      <ButtonGroup
        buttonLabels={[t('pendleModal.stake'), t('pendleModal.withdraw')]}
        activeButtonIndex={isStake ? 0 : 1}
        onButtonClick={() => {}}
        fullWidth
      />

      <AmountForm onSubmit={() => Promise.resolve()} maxAmount={availableTokens.toFixed()}>
        {({ dirty, values, setFieldValue }) => {
          const parsedAmount = Number.parseFloat(values.amount || '0');
          const hasAmount = dirty && parsedAmount > 0;
          const sliderValue =
            availableTokens.gt(0) && hasAmount
              ? Math.min(100, Math.round((parsedAmount / availableTokens.toNumber()) * 100))
              : 0;

          return (
            <div className="space-y-4">
              <div>
                <p className="text-b1r text-grey mb-2">
                  {isStake ? t('pendleModal.stakeLabel') : t('pendleModal.withdraw')}
                </p>
                <FormikTokenTextField
                  name="amount"
                  token={mockPtToken as any}
                  rightMaxButton={{
                    label: t('pendleModal.max'),
                    onClick: () => setFieldValue('amount', availableTokens.toFixed()),
                  }}
                  max={availableTokens.toFixed()}
                />
              </div>

              <LabeledInlineContent label={t('pendleModal.available')}>
                <span className="text-b1s">15.1925 Pt-clisBNBx</span>
              </LabeledInlineContent>

              <div className="space-y-2">
                <Slider
                  value={sliderValue}
                  onChange={v =>
                    setFieldValue('amount', availableTokens.multipliedBy(v / 100).toFixed(18))
                  }
                  min={0}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between">
                  <span className="text-b2r text-grey">0%</span>
                  <span className="text-b2r text-grey">100%</span>
                </div>
              </div>

              <LabeledInlineContent
                label={t('pendleModal.currentStaked')}
                tooltip={t('pendleModal.currentStakedTooltip')}
              >
                <span className="text-b1s">500 Pt-clisBNBx</span>
              </LabeledInlineContent>

              {hasAmount && (
                <ConvertDetails
                  fromSymbol={isStake ? 'BNB' : 'Pt-clisBNBx'}
                  toSymbol={isStake ? 'Pt-clisBNBx' : 'BNB'}
                  fee="$0.12"
                  minReceived={isStake ? '1.234 Pt-clisBNBx' : '1.189 BNB'}
                  estReceived={isStake ? '1.245 Pt-clisBNBx' : '1.201 BNB'}
                />
              )}

              {isStake && (
                <LabeledInlineContent
                  label={t('pendleModal.effectiveFixedApr')}
                  tooltip={t('pendleModal.effectiveFixedAprTooltip')}
                >
                  <span className="text-b1s text-green">
                    {formatPercentageToReadableValue(mockVault.stakingAprPercentage)}
                  </span>
                </LabeledInlineContent>
              )}

              <LabeledInlineContent
                label={isStake ? t('pendleModal.estYield') : t('pendleModal.estPenalty')}
              >
                <span className="text-b1s">--</span>
              </LabeledInlineContent>

              <LabeledInlineContent
                label={t('pendleModal.maturityDate')}
                tooltip={t('pendleModal.maturityDateTooltip')}
              >
                <span className="text-b1s">
                  Jun 10, 2026
                  <span className="text-b2r text-grey ml-2">90 days</span>
                </span>
              </LabeledInlineContent>

              <FormikSubmitButton
                className="w-full"
                enabledLabel={
                  isStake ? t('pendleModal.submitStake') : t('pendleModal.submitWithdraw')
                }
                disabledLabel={t('pendleModal.submitDisabled')}
              />

              <NoticeInfo description={t('pendleModal.maturityDisclaimer')} />
            </div>
          );
        }}
      </AmountForm>
    </div>
  );
};

export const PendleModalPreview = () => {
  const [stakeOpen, setStakeOpen] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [showFormPreviews, setShowFormPreviews] = useState(false);

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mb-6">
        <h1 className="text-white text-xl font-bold mb-4">PendleModal Preview</h1>
        <div className="flex gap-4 flex-wrap">
          <button
            type="button"
            className="px-4 py-2 bg-blue text-white rounded"
            onClick={() => setStakeOpen(true)}
          >
            Open Stake Modal
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue text-white rounded"
            onClick={() => setWithdrawOpen(true)}
          >
            Open Withdraw Modal
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue text-white rounded"
            onClick={() => setShowFormPreviews(v => !v)}
          >
            Toggle Form Previews (connected state)
          </button>
        </div>
      </div>

      {showFormPreviews && (
        <div className="flex gap-6 mb-8 flex-wrap" id="form-previews">
          <div>
            <p className="text-grey text-b2r mb-2">Stake form (connected)</p>
            <FormPreview mode="stake" />
          </div>
          <div>
            <p className="text-grey text-b2r mb-2">Withdraw form (connected)</p>
            <FormPreview mode="withdraw" />
          </div>
        </div>
      )}

      <PendleModal
        vault={mockVault as any}
        isOpen={stakeOpen}
        handleClose={() => setStakeOpen(false)}
        initialMode="stake"
      />

      <PendleModal
        vault={mockVault as any}
        isOpen={withdrawOpen}
        handleClose={() => setWithdrawOpen(false)}
        initialMode="withdraw"
      />
    </div>
  );
};

export default PendleModalPreview;
