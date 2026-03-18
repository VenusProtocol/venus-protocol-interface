import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import type { Tx } from 'types';
import { generateExplorerUrl, getTransactionName } from 'utilities';
import { Delimiter } from '../../Delimiter';
import { Icon } from '../../Icon';
import { Events } from './Events';
import { getTransactionIcon } from './getTransactionIcon';

export interface TransactionRowProps {
  transaction: Tx;
  className?: string;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, className }) => {
  const { chainId, txType, hash, blockTimestamp } = transaction;
  const { t } = useTranslation();

  const transactionTitle = useMemo(
    () =>
      getTransactionName({
        txType,
        t,
      }),
    [t, txType],
  );

  return (
    <a
      className={cn(
        'flex flex-col px-4 py-3 border border-dark-blue-hover rounded-xl w-full items-center justify-evenly group hover:bg-background-hover @2xl:border-0 @2xl:flex-row @2xl:px-6 @2xl:py-0 @2xl:h-16 @2xl:rounded-none',
        className,
      )}
      href={generateExplorerUrl({
        hash,
        urlType: 'tx',
        chainId,
      })}
      onClick={e => e.stopPropagation()}
      target="_blank"
      rel="noreferrer"
    >
      <div className="flex flex-col w-full @2xl:flex-row @2xl:gap-x-4">
        <div className="flex w-full @2xl:w-70 items-center">
          <div className="p-1.5 @2xl:p-2 mr-2 @2xl:mr-3 flex items-center justify-center bg-lightGrey rounded-full">
            <Icon className="h-3 w-3 @2xl:h-4 @2xl:w-4" name={getTransactionIcon(txType)} />
          </div>

          <div className="flex flex-row w-full @2xl:w-auto items-center @2xl:items-start justify-between @2xl:flex-col">
            <span className="text-sm">{transactionTitle}</span>

            <span className="text-light-grey text-xs">
              {t('account.transactions.date.time', {
                date: new Date(blockTimestamp),
              })}
            </span>
          </div>
        </div>

        <Delimiter className="my-3 @2xl:hidden" />

        <Events transaction={transaction} />
      </div>
    </a>
  );
};
