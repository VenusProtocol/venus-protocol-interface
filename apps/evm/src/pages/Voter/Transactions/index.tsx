import { cn } from '@venusprotocol/ui';
import { useMemo } from 'react';

import { ButtonWrapper, Card, Spinner, Table, type TableColumn } from 'components';
import { Link } from 'containers/Link';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { VoteDetail } from 'types';
import { convertMantissaToTokens, generateExplorerUrl } from 'utilities';

import { routes } from 'constants/routing';
import { ActionCell } from './ActionCell';

interface TransactionsProps {
  address: string;
  voterTransactions: VoteDetail[] | undefined;
  className?: string;
}

export const Transactions: React.FC<TransactionsProps> = ({
  className,
  address,
  voterTransactions = [],
}) => {
  const { t } = useTranslation();
  const { chainId } = useChainId();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const columns: TableColumn<VoteDetail>[] = useMemo(
    () => [
      {
        key: 'action',
        label: t('voterDetail.actions'),
        selectOptionLabel: t('voterDetail.actions'),
        renderCell: transaction => <ActionCell support={transaction.support} />,
      },
      {
        key: 'proposalId',
        label: t('voterDetail.proposalNumber'),
        selectOptionLabel: t('voterDetail.proposalNumber'),
        renderCell: transaction => (
          <Link
            to={routes.governanceProposal.path.replace(
              ':proposalId',
              transaction.proposalId.toString(),
            )}
            className="text-white underline hover:text-blue"
          >
            {transaction.proposalId}
          </Link>
        ),
      },
      {
        key: 'amount',
        label: t('voterDetail.amount'),
        selectOptionLabel: t('voterDetail.amount'),
        align: 'right',
        renderCell: transaction =>
          convertMantissaToTokens({
            value: transaction.votesMantissa,
            token: xvs,
            returnInReadableFormat: true,
          }),
      },
    ],
    [t, xvs],
  );

  return (
    <Card className={cn('flex flex-col border-0 bg-transparent px-0 py-6 sm:border', className)}>
      <h2 className="mx-0 mb-6 text-p2s sm:mx-6 sm:mb-0">{t('voterDetail.transactions')}</h2>

      {voterTransactions?.length ? (
        <Table
          columns={columns}
          data={voterTransactions}
          rowKeyExtractor={row => `voter-transaction-table-row-${row.proposalId}`}
          breakpoint="sm"
          className="border-0 bg-transparent py-4"
        />
      ) : (
        <Spinner className="mb-4 xl:mb-0" />
      )}

      <ButtonWrapper
        variant="secondary"
        className="text-white mt-4 hover:no-underline sm:mx-6 sm:mt-0"
        asChild
      >
        <Link
          href={generateExplorerUrl({
            hash: address,
            urlType: 'address',
            chainId,
          })}
        >
          {t('voterDetail.viewAll')}
        </Link>
      </ButtonWrapper>
    </Card>
  );
};

export default Transactions;
