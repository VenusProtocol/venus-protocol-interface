import { cn } from '@venusprotocol/ui';
import type BigNumber from 'bignumber.js';

import {
  BalanceUpdates,
  Delimiter,
  LabeledValueUpdate,
  type LabeledValueUpdateProps,
} from 'components';
import { TxFormSubmitButton, type TxFormSubmitButtonProps } from 'containers/TxFormSubmitButton';
import { useTranslation } from 'libs/translations';
import { AccountHealth } from 'pages/Trade/AccountHealth';
import { formatLiquidationPriceTokensToReadableValue } from 'pages/Trade/formatLiquidationPriceTokensToReadableValue';
import { Fragment } from 'react/jsx-runtime';
import type { SwapQuote, TradePosition } from 'types';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';
import type { PositionFormAction } from '../..';
import { LikelyToFailWarning } from './LikelyToFailWarning';

export interface FooterProps extends TxFormSubmitButtonProps {
  position: TradePosition;
  swapQuotes: SwapQuote[];
  pnlDsaTokens?: BigNumber;
  action?: PositionFormAction;
  simulatedPosition?: TradePosition;
}

export const Footer: React.FC<FooterProps> = ({
  submitButtonLabel,
  position,
  simulatedPosition,
  swapQuotes,
  isFormValid,
  balanceMutations,
  className,
  action,
  pnlDsaTokens,
  ...otherSubmitButtonProps
}) => {
  const { t } = useTranslation();

  const rows: LabeledValueUpdateProps[] = [];

  if (action !== 'close') {
    rows.push({
      label: t('trade.operationForm.openForm.liquidationPrice'),
      original: formatLiquidationPriceTokensToReadableValue(
        action === 'open'
          ? {
              value: simulatedPosition?.liquidationPriceTokens,
              token: simulatedPosition?.shortAsset.vToken.underlyingToken,
              t,
            }
          : {
              value: position.liquidationPriceTokens,
              token: position.shortAsset.vToken.underlyingToken,
              t,
            },
      ),
      update:
        action === 'open' || !simulatedPosition
          ? undefined
          : formatLiquidationPriceTokensToReadableValue({
              value: simulatedPosition.liquidationPriceTokens,
              token: simulatedPosition.shortAsset.vToken.underlyingToken,
              t,
            }),
    });
  }

  if (action === 'open' || action === 'increase' || action === 'reduce') {
    rows.push({
      label: t('trade.operationForm.openForm.entryPrice'),
      original:
        action === 'open'
          ? formatTokensToReadableValue({
              value: simulatedPosition?.entryPriceTokens,
              token: simulatedPosition?.shortAsset.vToken.underlyingToken,
              addSymbol: false,
            })
          : formatTokensToReadableValue({
              value: position.entryPriceTokens,
              token: position.shortAsset.vToken.underlyingToken,
              addSymbol: false,
            }),
      update:
        action === 'open' || !simulatedPosition
          ? undefined
          : formatTokensToReadableValue({
              value: simulatedPosition.entryPriceTokens,
              token: simulatedPosition.shortAsset.vToken.underlyingToken,
              addSymbol: false,
            }),
    });
  }

  if (pnlDsaTokens) {
    rows.push({
      label: t('trade.operationForm.openForm.pnl'),
      original: (
        <span className={pnlDsaTokens.isNegative() ? 'text-red' : 'text-green'}>
          {formatTokensToReadableValue({
            value: pnlDsaTokens,
            token: position.dsaAsset.vToken.underlyingToken,
          })}
        </span>
      ),
      deltaAmountCents: pnlDsaTokens.multipliedBy(position.dsaAsset.tokenPriceCents),
    });
  }

  if (action !== 'close') {
    rows.push({
      label: t('trade.operationForm.openForm.netApy'),
      original: formatPercentageToReadableValue(
        action === 'open' ? simulatedPosition?.netApyPercentage : position.netApyPercentage,
      ),
      update:
        action === 'open' || !simulatedPosition
          ? undefined
          : formatPercentageToReadableValue(simulatedPosition?.netApyPercentage),
    });
  }

  return (
    <div className={cn('flex flex-col gap-y-8', className)}>
      <div className="flex flex-col gap-y-4">
        <BalanceUpdates pool={position.pool} balanceMutations={balanceMutations} />

        {rows.length > 0 && <Delimiter />}

        {rows.map((row, index) => (
          <Fragment key={row.label?.toString() ?? index}>
            <LabeledValueUpdate {...row} />

            {index < rows.length - 1 && <Delimiter />}
          </Fragment>
        ))}

        {action !== 'close' && (
          <>
            <Delimiter />

            <AccountHealth pool={position.pool} simulatedPool={simulatedPosition?.pool} />
          </>
        )}
      </div>

      <div className="flex flex-col gap-y-4">
        <LikelyToFailWarning position={position} swapQuotes={swapQuotes} />

        <TxFormSubmitButton
          submitButtonLabel={submitButtonLabel}
          balanceMutations={balanceMutations}
          isFormValid={isFormValid}
          simulatedPool={simulatedPosition?.pool}
          {...otherSubmitButtonProps}
        />
      </div>
    </div>
  );
};
