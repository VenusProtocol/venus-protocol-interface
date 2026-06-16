import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import type { Address } from 'viem';

import { InfoIcon, Pagination, Table, type TableColumn, Username } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';

import { RankBadge } from './RankBadge';

const RANKS_PAGE_PARAM_KEY = 'ranksPage';

interface PrimeRank {
  rank: number;
  address: Address;
  primeScore: number;
}

const ITEMS_PER_PAGE = 10;

// TODO: replace this placeholder ranking with the data returned by the API
const placeholderRanks: PrimeRank[] = Array.from({ length: 150 }, (_, index) => ({
  rank: index + 1,
  address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8dD4d',
  primeScore: 50_000,
}));

export interface RankTableProps {
  className?: string;
}

export const RankTable: React.FC<RankTableProps> = ({ className }) => {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage } = useUrlPagination({ paramKey: RANKS_PAGE_PARAM_KEY });

  const columns: TableColumn<PrimeRank>[] = useMemo(
    () => [
      {
        key: 'wallet',
        label: (
          <span className="inline-flex items-center gap-x-2">
            {t('primeLeaderboard.rankTable.columns.wallet')}
            <InfoIcon tooltip={t('primeLeaderboard.rankTable.walletTooltip')} />
          </span>
        ),
        selectOptionLabel: t('primeLeaderboard.rankTable.columns.wallet'),
        renderCell: ({ rank, address }) => (
          <div className="flex items-center gap-x-2">
            {rank <= 3 && <RankBadge rank={rank} />}

            <span className="text-b1r text-white">#{rank}</span>

            <Username address={address} className="text-b1r text-light-grey" />
          </div>
        ),
      },
      {
        key: 'primeScore',
        label: t('primeLeaderboard.rankTable.columns.primeScore'),
        selectOptionLabel: t('primeLeaderboard.rankTable.columns.primeScore'),
        align: 'right',
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.primeScore - rowB.primeScore
            : rowB.primeScore - rowA.primeScore,
        renderCell: ({ primeScore }) => (
          <span className="text-b1r text-white">{new BigNumber(primeScore).toFormat()}</span>
        ),
      },
    ],
    [t],
  );

  const defaultSortColumn = columns.find(column => column.key === 'primeScore');

  const pageRanks = placeholderRanks.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <Table
        variant="primary"
        className="border-0 p-0"
        columns={columns}
        data={pageRanks}
        rowKeyExtractor={row => `prime-rank-table-row-${row.rank}`}
        initialOrder={defaultSortColumn && { orderBy: defaultSortColumn, orderDirection: 'desc' }}
      />

      <Pagination
        itemsCount={placeholderRanks.length}
        itemsPerPageCount={ITEMS_PER_PAGE}
        paramKey={RANKS_PAGE_PARAM_KEY}
        onChange={setCurrentPage}
      />
    </div>
  );
};
