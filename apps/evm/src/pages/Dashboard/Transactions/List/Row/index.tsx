import { cn } from '@venusprotocol/ui';
import type { AmountTransaction } from 'clients/api';
import { Card, Delimiter, Icon, TokenIcon } from 'components';
import { Link } from 'containers/Link';
import { format } from 'date-fns';
import { useTranslation } from 'libs/translations';
import { generateExplorerUrl } from 'utilities';
import { Details } from './Details';
import { getTransactionIcon } from './getTransactionIcon';
import { getTransactionTitle } from './getTransactionTitle';

export interface RowProps {
  amountTransaction: AmountTransaction;
  className?: string;
}

export const Row: React.FC<RowProps> = ({ amountTransaction, className }) => {
  const { chainId, txType, hash, blockTimestamp, token } = amountTransaction;
  const { t } = useTranslation();

  const transactionTitle = getTransactionTitle(txType, t);

  const href = generateExplorerUrl({
    hash,
    urlType: 'tx',
    chainId,
  });

  return (
    <Card
      asChild
      className={cn(
        'flex flex-col px-4 pt-6 pb-3 rounded-xl w-full items-center justify-evenly group text-white hover:text-white active:text-white hover:no-underline active:no-underline sm:flex-row sm:h-18 sm:py-0 sm:border-0 hover:bg-dark-blue-hover',
        className,
      )}
    >
      <Link href={href} target="_blank" rel="noreferrer">
        <div className="flex flex-col w-full sm:flex-row sm:justify-between">
          <div className="flex items-center mb-5 sm:mb-0 sm:flex-1">
            <div className="size-8 shrink-0 p-0 mr-2 flex items-center justify-center bg-dark-grey rounded-full">
              <Icon className="size-4" name={getTransactionIcon(txType)} />
            </div>

            <div className="flex flex-row items-center grow sm:items-start justify-between sm:flex-col">
              <span className="text-sm">{transactionTitle}</span>
              <span className="text-grey text-xs">{format(blockTimestamp, 'hh:mm aa')}</span>
            </div>
          </div>

          <Delimiter className="mb-3 sm:hidden" />

          <div className="flex items-center sm:flex-1">
            {'iconSrc' in token && <TokenIcon className="mr-2 self-start size-6" token={token} />}

            <Details className="flex-1" amountTransaction={amountTransaction} />
          </div>
        </div>
      </Link>
    </Card>
  );
};
