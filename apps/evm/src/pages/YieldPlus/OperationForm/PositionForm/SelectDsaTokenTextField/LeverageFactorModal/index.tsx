import BigNumber from 'bignumber.js';

import { Button, Modal, Notice, Slider } from 'components';
import { useTranslation } from 'libs/translations';
import { calculateMaxBorrowShortTokens } from 'pages/YieldPlus/OperationForm/calculateMaxBorrowShortTokens';
import { useTokenPair } from 'pages/YieldPlus/useTokenPair';
import { useState } from 'react';
import { formatTokensToReadableValue } from 'utilities';
import { StepButton } from './StepButton';
import { getSteps } from './getSteps';

const MINIMUM_LEVERAGE_FACTOR = 1;
const STEP = 0.01;

export interface LeverageFactorModalProps {
  leverageFactor: number;
  onChangeLeverageFactor: (newLeverageFactor: number) => void;
  maximumLeverageFactor: number;
  onClose: () => void;
  proportionalCloseTolerancePercentage: number;
  shortTokenPriceCents: BigNumber;
  shortTokenDecimals: number;
  longTokenPriceCents: BigNumber;
  longTokenCollateralFactor: number;
  dsaTokenCollateralFactor: number;
  dsaTokenPriceCents?: number;
  dsaAmountTokens?: BigNumber;
}

export const LeverageFactorModal: React.FC<LeverageFactorModalProps> = ({
  leverageFactor,
  maximumLeverageFactor,
  onChangeLeverageFactor,
  dsaAmountTokens,
  dsaTokenPriceCents,
  dsaTokenCollateralFactor,
  longTokenPriceCents,
  longTokenCollateralFactor,
  shortTokenPriceCents,
  shortTokenDecimals,
  onClose,
}) => {
  const { t } = useTranslation();
  const { shortToken } = useTokenPair();

  const [newLeverageFactor, setNewLeverageFactor] = useState(leverageFactor);

  const handleSubmit = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();

    onChangeLeverageFactor(newLeverageFactor);
    onClose();
  };

  const maximumShortAmountTokens =
    dsaAmountTokens && typeof dsaTokenPriceCents === 'number'
      ? calculateMaxBorrowShortTokens({
          dsaAmountTokens,
          dsaTokenPriceCents,
          dsaTokenCollateralFactor,
          longAmountTokens: new BigNumber(0),
          longTokenPriceCents,
          longTokenCollateralFactor,
          shortAmountTokens: new BigNumber(0),
          shortTokenPriceCents,
          leverageFactor: newLeverageFactor,
          shortTokenDecimals,
        })
      : undefined;

  const readableMaximumShortAmount = formatTokensToReadableValue({
    value: maximumShortAmountTokens,
    token: shortToken,
  });

  const steps = getSteps({
    min: MINIMUM_LEVERAGE_FACTOR,
    max: maximumLeverageFactor,
  });

  const decreaseLeverageFactor = () => {
    if (newLeverageFactor > MINIMUM_LEVERAGE_FACTOR) {
      setNewLeverageFactor(currNewLeverageFactor =>
        new BigNumber(currNewLeverageFactor).minus(STEP).toNumber(),
      );
    }
  };

  const increaseLeverageFactor = () => {
    if (newLeverageFactor < maximumLeverageFactor) {
      setNewLeverageFactor(currNewLeverageFactor =>
        new BigNumber(currNewLeverageFactor).plus(STEP).toNumber(),
      );
    }
  };

  return (
    <Modal isOpen handleClose={onClose} title={t('operationForm.leverageFactorModal.title')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <div className="border border-background-hover rounded-lg flex items-center justify-between text-b1s">
          <StepButton onClick={decreaseLeverageFactor}>-</StepButton>

          <p>{t('operationForm.leverageFactor', { leverageFactor: newLeverageFactor })}</p>

          <StepButton onClick={increaseLeverageFactor}>+</StepButton>
        </div>

        <div className="flex flex-col gap-y-2">
          <Slider
            value={newLeverageFactor}
            onChange={setNewLeverageFactor}
            step={STEP}
            min={MINIMUM_LEVERAGE_FACTOR}
            max={maximumLeverageFactor}
          />

          <div className="flex items-center justify-between">
            {steps.map(step => (
              <p className="text-b2r text-light-grey">
                {t('operationForm.leverageFactor', { leverageFactor: step })}
              </p>
            ))}
          </div>
        </div>

        {maximumShortAmountTokens && (
          <p className="text-light-grey text-b1r">
            {t('operationForm.leverageFactorModal.maximumShortAmount', {
              value: readableMaximumShortAmount,
            })}
          </p>
        )}

        <Notice description={t('operationForm.leverageFactorModal.warning')} />

        <Button type="submit" className="w-full">
          {t('operationForm.leverageFactorModal.submitButtonLabel')}
        </Button>
      </form>
    </Modal>
  );
};
