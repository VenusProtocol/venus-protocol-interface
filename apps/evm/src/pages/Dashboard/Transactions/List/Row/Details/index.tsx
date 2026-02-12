import { cn } from '@venusprotocol/ui';
import type { AmountTransaction } from 'clients/api';
import { TxType } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { TransactionText } from './TransactionText';

export interface DetailsProps {
  amountTransaction: AmountTransaction;
  className?: string;
}

export const Details: React.FC<DetailsProps> = ({ amountTransaction, className }) => {
  const { amountTokens, amountCents, token, txType, poolName, vTokenSymbol } = amountTransaction;

  let description = `${vTokenSymbol} • ${poolName}`;

  if (txType === TxType.EnterMarket || txType === TxType.ExitMarket) {
    description = poolName;
  } else if (txType !== TxType.Approve && amountCents) {
    description = `${formatCentsToReadableValue({
      value: amountCents,
    })} • ${description}`;
  }

  return (
    <div className={cn('flex flex-col self-start', className)}>
      <span className="text-sm">
        <TransactionText
          amountTokens={amountTokens}
          token={token}
          txType={txType}
          vTokenSymbol={vTokenSymbol}
        />
      </span>

      <span className="text-grey text-xs">{description}</span>
    </div>
  );
};
