import { cn } from '@venusprotocol/ui';
import type { AmountTransaction } from 'clients/api';
import { Delimiter, Icon, type IconName, TokenIcon } from 'components';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { TxType } from 'types';
import { generateExplorerUrl } from 'utilities';
import { TransactionDetails } from '../TransactionDetails';

export interface TransactionRowProps {
  transactionData: AmountTransaction;
  className?: string;
}

const getTransactionIcon = (txType: TxType): IconName => {
  switch (txType) {
    case TxType.Mint:
    case TxType.Repay:
      return 'transactionIn';
    case TxType.Borrow:
    case TxType.Redeem:
      return 'transactionOut';
    default:
      return 'transactionCollateral';
  }
};

export const TransactionRow: React.FC<TransactionRowProps> = ({ transactionData, className }) => {
  const { chainId, txType, hash, blockTimestamp, token } = transactionData;
  const { t } = useTranslation();

  const transactionTitle = useMemo(() => {
    switch (txType) {
      case TxType.Mint:
        return t('account.transactions.txType.mint');
      case TxType.Repay:
        return t('account.transactions.txType.repay');
      case TxType.Borrow:
        return t('account.transactions.txType.borrow');
      case TxType.Redeem:
        return t('account.transactions.txType.redeem');
      case TxType.Approve:
        return t('account.transactions.txType.approve');
      case TxType.ExitMarket:
        return t('account.transactions.txType.exitMarket');
      default:
        return t('account.transactions.txType.enterMarket');
    }
  }, [t, txType]);

  return (
    <a
      className={cn(
        'flex flex-col px-4 py-3 bg-cards rounded-xl w-full items-center justify-evenly group md:flex-row md:px-6 md:py-0 md:h-16 md:hover:bg-lightGrey md:rounded-none',
        className,
      )}
      href={generateExplorerUrl({
        hash,
        urlType: 'tx',
        chainId,
      })}
      target="_blank"
      rel="noreferrer"
    >
      <div className={'flex flex-col md:flex-row w-full'}>
        <div className="flex w-full md:w-70 items-center">
          <div className="p-[6px] md:p-2 mr-2 md:mr-3 flex items-center justify-center bg-lightGrey rounded-full">
            <Icon className="h-3 w-3 md:h-4 md:w-4" name={getTransactionIcon(txType)} />
          </div>
          <div className="flex flex-row w-full md:w-auto items-center md:items-start justify-between md:flex-col">
            <span className="text-sm">{transactionTitle}</span>
            <span className="text-grey text-xs">
              {t('account.transactions.date.time', {
                date: new Date(blockTimestamp),
              })}
            </span>
          </div>
        </div>

        <Delimiter className="my-3 md:hidden" />

        <div className="flex w-full items-center">
          {'iconSrc' in token && <TokenIcon className="mr-2 self-start" token={token} />}
          <TransactionDetails className="flex-1" transactionData={transactionData} />
          <div className="hidden md:flex items-center text-grey md:group-hover:text-white space-x-1 mt-1">
            <span className="hidden lg:block text-sm underline">
              {t('account.transactions.view')}
            </span>
            <Icon className="md:group-hover:text-white" name="transactionLink" />
          </div>
        </div>
      </div>
    </a>
  );
};
