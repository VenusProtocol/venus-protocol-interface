import { cn } from '@venusprotocol/ui';
import type { AmountTransaction } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { TxType } from 'types';
import { formatCentsToReadableValue, formatTokensToReadableValue } from 'utilities';

export interface TransactionDetailsProps {
  transactionData: AmountTransaction;
  className?: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactionData,
  className,
}) => {
  const { amountTokens, amountCents, token, txType, poolName, vTokenSymbol } = transactionData;
  const { Trans } = useTranslation();

  const transactionText = useMemo(() => {
    switch (txType) {
      case TxType.Approve:
        return (
          <Trans
            i18nKey="account.transactions.txText.approve"
            values={{
              tokenAmount: formatTokensToReadableValue({
                token,
                value: amountTokens,
              }),
            }}
          />
        );
      case TxType.EnterMarket:
        return (
          <Trans
            i18nKey="account.transactions.txText.enterMarket"
            components={{ Styled: <span className="text-green" /> }}
            values={{ vTokenSymbol }}
          />
        );
      case TxType.ExitMarket:
        return (
          <Trans
            i18nKey="account.transactions.txText.exitMarket"
            components={{ Styled: <span className="text-red" /> }}
            values={{ vTokenSymbol }}
          />
        );
      default:
        return formatTokensToReadableValue({
          token,
          value: amountTokens,
        });
    }
  }, [amountTokens, Trans, txType, token, vTokenSymbol]);

  const transactionSecondaryText = useMemo(() => {
    const text =
      txType !== TxType.Approve && amountCents
        ? `${formatCentsToReadableValue({ value: amountCents })} • ${vTokenSymbol} • ${poolName}`
        : `${vTokenSymbol} • ${poolName}`;
    switch (txType) {
      case TxType.EnterMarket:
      case TxType.ExitMarket:
        return poolName;
      default:
        return text;
    }
  }, [amountCents, txType, poolName, vTokenSymbol]);

  return (
    <div className={cn('flex flex-col self-start', className)}>
      <span className="text-sm">{transactionText}</span>
      <span className="text-grey text-xs">{transactionSecondaryText}</span>
    </div>
  );
};
