import { cn } from '@venusprotocol/ui';

import {
  BalanceUpdates,
  Delimiter,
  LabeledValueUpdate,
  type LabeledValueUpdateProps,
} from 'components';
import { TxFormSubmitButton, type TxFormSubmitButtonProps } from 'containers/TxFormSubmitButton';
import { useTranslation } from 'libs/translations';
import { AccountHealth } from 'pages/YieldPlus/AccountHealth';
import { Fragment } from 'react/jsx-runtime';
import type { YieldPlusPosition } from 'types';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';

export interface FooterProps extends TxFormSubmitButtonProps {
  isNewPosition?: boolean;
  simulatedPosition?: YieldPlusPosition;
  position: YieldPlusPosition;
}

export const Footer: React.FC<FooterProps> = ({
  submitButtonLabel,
  position,
  simulatedPosition,
  isFormValid,
  balanceMutations,
  className,
  isNewPosition = false,
  ...otherSubmitButtonProps
}) => {
  const { t } = useTranslation();

  const rows: LabeledValueUpdateProps[] = [
    {
      label: t('yieldPlus.operationForm.openForm.liquidationPrice'),
      original: formatTokensToReadableValue(
        isNewPosition
          ? {
              value: simulatedPosition?.liquidationPriceTokens,
              token: simulatedPosition?.shortAsset.vToken.underlyingToken,
            }
          : {
              value: position.liquidationPriceTokens,
              token: position.shortAsset.vToken.underlyingToken,
            },
      ),
      update:
        isNewPosition || !simulatedPosition
          ? undefined
          : formatTokensToReadableValue({
              value: simulatedPosition.liquidationPriceTokens,
              token: simulatedPosition.shortAsset.vToken.underlyingToken,
            }),
      deltaAmountCents:
        isNewPosition || !simulatedPosition
          ? undefined
          : simulatedPosition.liquidationPriceCents - position.liquidationPriceCents,
    },
    {
      label: t('yieldPlus.operationForm.openForm.entryPrice'),
      original: formatTokensToReadableValue(
        isNewPosition
          ? {
              value: simulatedPosition?.entryPriceTokens,
              token: simulatedPosition?.shortAsset.vToken.underlyingToken,
            }
          : {
              value: position.entryPriceTokens,
              token: position.shortAsset.vToken.underlyingToken,
            },
      ),
      update:
        isNewPosition || !simulatedPosition
          ? undefined
          : formatTokensToReadableValue({
              value: simulatedPosition.entryPriceTokens,
              token: simulatedPosition.shortAsset.vToken.underlyingToken,
            }),
      deltaAmountCents:
        isNewPosition || !simulatedPosition
          ? undefined
          : simulatedPosition.entryPriceCents - position.entryPriceCents,
    },
    {
      label: t('yieldPlus.operationForm.openForm.netApy'),
      original: formatPercentageToReadableValue(
        isNewPosition ? simulatedPosition?.netApyPercentage : position.netApyPercentage,
      ),
      update:
        isNewPosition || !simulatedPosition
          ? undefined
          : formatPercentageToReadableValue(simulatedPosition?.netApyPercentage),
    },
  ];

  return (
    <div className={cn('flex flex-col gap-y-8', className)}>
      <div className="flex flex-col gap-y-4">
        <BalanceUpdates pool={position.pool} balanceMutations={balanceMutations} />

        <Delimiter />

        {rows.map((row, index) => (
          <Fragment key={row.label?.toString() ?? index}>
            <LabeledValueUpdate {...row} />

            <Delimiter />
          </Fragment>
        ))}

        <AccountHealth pool={simulatedPosition?.pool || position.pool} />
      </div>

      <TxFormSubmitButton
        submitButtonLabel={submitButtonLabel}
        balanceMutations={balanceMutations}
        isFormValid={isFormValid}
        simulatedPool={simulatedPosition?.pool}
        {...otherSubmitButtonProps}
      />
    </div>
  );
};
