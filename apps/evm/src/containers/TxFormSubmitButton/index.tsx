import { AcknowledgementToggle, cn } from 'components';
import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import { useTranslation } from 'libs/translations';
import { SubmitButton } from './SubmitButton';
import type { TxFormSubmitButtonProps } from './types';

export * from './types';

// TODO: add tests

export const TxFormSubmitButton: React.FC<TxFormSubmitButtonProps> = ({
  approval,
  submitButtonLabel,
  isFormValid,
  balanceMutations,
  simulatedPool,
  isUserAcknowledgingRisk,
  setAcknowledgeRisk,
  isUserAcknowledgingHighPriceImpact,
  setAcknowledgeHighPriceImpact,
  isLoading,
  swapFromToken,
  swapToToken,
  swapPriceImpactPercentage,
  analyticVariant,
  className,
}) => {
  const { t } = useTranslation();

  // Check if transaction is using a swap with a high price impact
  const isHighPriceImpactSwap =
    swapPriceImpactPercentage !== undefined &&
    swapPriceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
    swapPriceImpactPercentage < MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE;

  // Check if transaction would put user's health factor below moderate threshold
  const isRiskyTransaction =
    balanceMutations.some(b => b.action !== 'supply' && b.action !== 'repay') &&
    simulatedPool?.userHealthFactor !== undefined &&
    simulatedPool.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
    simulatedPool.userHealthFactor > HEALTH_FACTOR_LIQUIDATION_THRESHOLD;

  const isRisky = isHighPriceImpactSwap || isRiskyTransaction;

  return (
    <ConnectWallet className={cn('space-y-4', className)} analyticVariant={analyticVariant}>
      <div className="space-y-3">
        {isRiskyTransaction &&
          typeof isUserAcknowledgingRisk === 'boolean' &&
          setAcknowledgeRisk && (
            <AcknowledgementToggle
              value={isUserAcknowledgingRisk}
              onChange={(_, checked) => setAcknowledgeRisk(checked)}
              label={t('operationForm.acknowledgements.riskyOperation.label')}
              tooltip={t('operationForm.acknowledgements.riskyOperation.tooltip')}
            />
          )}

        {isHighPriceImpactSwap &&
          typeof isUserAcknowledgingHighPriceImpact === 'boolean' &&
          setAcknowledgeHighPriceImpact && (
            <AcknowledgementToggle
              value={isUserAcknowledgingHighPriceImpact}
              onChange={(_, checked) => setAcknowledgeHighPriceImpact(checked)}
              label={t('operationForm.acknowledgements.highPriceImpact.label')}
              tooltip={t('operationForm.acknowledgements.highPriceImpact.tooltip', {
                priceImpactPercentage: HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
              })}
            />
          )}

        <SubmitButton
          approval={approval}
          label={submitButtonLabel}
          isFormValid={isFormValid}
          isRisky={isRisky}
          isLoading={isLoading}
        />

        {swapFromToken && swapToToken && (
          <SwapDetails
            fromToken={swapFromToken}
            toToken={swapToToken}
            priceImpactPercentage={swapPriceImpactPercentage}
          />
        )}
      </div>
    </ConnectWallet>
  );
};
