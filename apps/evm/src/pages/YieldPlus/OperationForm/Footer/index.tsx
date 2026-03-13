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
import type { PositionFormAction } from '../PositionForm';

export interface FooterProps extends TxFormSubmitButtonProps {
  action?: PositionFormAction;
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
  action,
  ...otherSubmitButtonProps
}) => {
  const { t } = useTranslation();

  const rows: LabeledValueUpdateProps[] = [
    {
      label: t('yieldPlus.operationForm.openForm.liquidationPrice'),
      original: formatTokensToReadableValue(
        action === 'open'
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
        action === 'open' || !simulatedPosition
          ? undefined
          : formatTokensToReadableValue({
              value: simulatedPosition.liquidationPriceTokens,
              token: simulatedPosition.shortAsset.vToken.underlyingToken,
            }),
      deltaAmountCents:
        action === 'open' || !simulatedPosition
          ? undefined
          : simulatedPosition.liquidationPriceCents - position.liquidationPriceCents,
    },
  ];

  if (action === 'open') {
    rows.push({
      label: t('yieldPlus.operationForm.openForm.entryPrice'),
      original: formatTokensToReadableValue({
        value: simulatedPosition?.priceTokens,
        token: simulatedPosition?.shortAsset.vToken.underlyingToken,
      }),
      update:
        simulatedPosition &&
        formatTokensToReadableValue({
          value: simulatedPosition.priceTokens,
          token: simulatedPosition.shortAsset.vToken.underlyingToken,
        }),
      deltaAmountCents: simulatedPosition && simulatedPosition.priceCents - position.priceCents,
    });
  }

  if (action === 'increase' || action === 'reduce') {
    rows.push({
      label: t('yieldPlus.operationForm.openForm.averageEntryPrice'),
      original: formatTokensToReadableValue({
        value: position.averageEntryPriceTokens,
        token: position.shortAsset.vToken.underlyingToken,
      }),
      update:
        simulatedPosition &&
        formatTokensToReadableValue({
          value: simulatedPosition.averageEntryPriceTokens,
          token: simulatedPosition.shortAsset.vToken.underlyingToken,
        }),
      deltaAmountCents:
        simulatedPosition &&
        simulatedPosition.averageEntryPriceCents - position.averageEntryPriceCents,
    });
  }
  // TODO: add average entry price when increasing or reducing a position

  rows.push({
    label: t('yieldPlus.operationForm.openForm.netApy'),
    original: formatPercentageToReadableValue(
      action === 'open' ? simulatedPosition?.netApyPercentage : position.netApyPercentage,
    ),
    update:
      action === 'open' || !simulatedPosition
        ? undefined
        : formatPercentageToReadableValue(simulatedPosition?.netApyPercentage),
  });

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
