import { TertiaryButton, cn } from '@venusprotocol/ui';

import { Icon, LabeledInlineContent, Modal, TextField, type TextFieldProps } from 'components';
import {
  DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';
import {
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getDecimals,
} from 'utilities';

export const slippageToleranceOptions = ['0.1', String(DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE), '1'];
const MAX_SLIPPAGE_TOLERANCE_DECIMALS = 2;

export interface SwapDetailsProps {
  exchangeRate: BigNumber;
  fromToken: Token;
  toToken: Token;
  priceImpactPercentage: number;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({
  exchangeRate,
  fromToken,
  toToken,
  priceImpactPercentage,
}) => {
  const { t } = useTranslation();

  const [userChainSettings, setUserChainSettings] = useUserChainSettings();
  const [isSlippageToleranceModalOpen, setIsSlippageToleranceModalOpen] = useState(false);

  const readableExchangeRate = formatTokensToReadableValue({
    value: exchangeRate,
    token: toToken,
    addSymbol: false,
  });

  const readablePriceImpact = formatPercentageToReadableValue(priceImpactPercentage);

  const userSlippageTolerancePercentage = userChainSettings.slippageTolerancePercentage
    ? userChainSettings.slippageTolerancePercentage
    : DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE;

  const readableUserSlippageTolerance = formatPercentageToReadableValue(
    userSlippageTolerancePercentage,
  );

  const openSlippageToleranceModal = () => setIsSlippageToleranceModalOpen(true);
  const closeSlippageToleranceModal = () => setIsSlippageToleranceModalOpen(false);

  const handlePriceImpactFieldChange: TextFieldProps['onChange'] = ({
    currentTarget: { value },
  }) => {
    // Forbid values with more 2 decimals
    const valueDecimals = getDecimals({ value });

    if (valueDecimals <= MAX_SLIPPAGE_TOLERANCE_DECIMALS) {
      setUserChainSettings({
        slippageTolerancePercentage: value,
      });
    }
  };

  const handleSlippageToleranceModalFieldChange = ({ value }: { value: string }) => {
    setUserChainSettings({
      slippageTolerancePercentage: value,
    });

    closeSlippageToleranceModal();
  };

  return (
    <>
      <div className="space-y-3">
        <LabeledInlineContent label={t('swapDetails.exchangeRate.label')}>
          {t('swapDetails.exchangeRate.value', {
            fromTokenSymbol: fromToken.symbol,
            toTokenSymbol: toToken.symbol,
            rate: readableExchangeRate,
          })}
        </LabeledInlineContent>

        <LabeledInlineContent label={t('swapDetails.slippageTolerance.label')}>
          <div className="flex items-center justify-center gap-x-1">
            {readableUserSlippageTolerance}

            <div className="flex items-center justify-center gap-x-1">
              <button type="button" onClick={openSlippageToleranceModal}>
                <Icon name="gear" className="size-5" />
              </button>
            </div>
          </div>
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('swapDetails.priceImpact.label')}
          tooltip={t('swapDetails.priceImpact.tooltip')}
        >
          <span
            className={cn(
              'align-sub',
              priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE && 'text-red',
            )}
          >
            {readablePriceImpact}
          </span>
        </LabeledInlineContent>
      </div>

      {isSlippageToleranceModalOpen && (
        <Modal
          isOpen
          handleClose={closeSlippageToleranceModal}
          title={t('swapDetails.slippageToleranceModal.title')}
        >
          <form className="space-y-6" onSubmit={closeSlippageToleranceModal}>
            <p className="text-grey">{t('swapDetails.slippageToleranceModal.description')}</p>

            <div className="flex items-center justify-between gap-x-3">
              <div className="flex items-center gap-x-2 px-2 w-full max-w-75 border border-lightGrey bg-background rounded-xl h-14">
                {slippageToleranceOptions.map(value => (
                  <TertiaryButton
                    key={value}
                    className={cn(
                      'flex-1 bg-transparent border-transparent text-grey hover:bg-lightGrey hover:border-lightGrey hover:text-offWhite active:bg-lightGrey active:border-lightGrey',
                      Number(value) === Number(userSlippageTolerancePercentage) &&
                        'bg-lightGrey text-offWhite',
                    )}
                    onClick={() =>
                      handleSlippageToleranceModalFieldChange({
                        value,
                      })
                    }
                  >
                    {formatPercentageToReadableValue(value)}
                  </TertiaryButton>
                ))}
              </div>

              <TextField
                placeholder={String(DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE)}
                step={0.01}
                min={0}
                max={slippageToleranceOptions[slippageToleranceOptions.length - 1]}
                value={userChainSettings.slippageTolerancePercentage}
                onChange={handlePriceImpactFieldChange}
                type="number"
                className="w-25"
                inputContainerClassName="h-14"
                autoFocus
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
