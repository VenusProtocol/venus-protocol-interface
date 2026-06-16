import { cn } from '@venusprotocol/ui';
import { useMemo } from 'react';
import type { Address } from 'viem';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { Pagination, Table, type TableColumn, Username } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';

interface PrimeReward {
  id: number;
  address: Address;
  totalRewardsCents: number;
  usdtRewardsCents: number;
  uRewardsCents: number;
}

const ITEMS_PER_PAGE = 10;
const REWARDS_PAGE_PARAM_KEY = 'rewardsPage';

// TODO: replace this placeholder list with the data returned by the API
const placeholderRewards: PrimeReward[] = Array.from({ length: 150 }, (_reward, id) => ({
  id,
  address: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8dD4d',
  totalRewardsCents: 50_000,
  usdtRewardsCents: 4_000_000,
  uRewardsCents: 2_236_000,
}));

export interface RewardTableProps {
  className?: string;
}

export const RewardTable: React.FC<RewardTableProps> = ({ className }) => {
  const { t } = useTranslation();
  const { currentPage, setCurrentPage } = useUrlPagination({ paramKey: REWARDS_PAGE_PARAM_KEY });

  const columns: TableColumn<PrimeReward>[] = useMemo(
    () => [
      {
        key: 'wallet',
        label: t('primeLeaderboard.rewardTable.columns.wallet'),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.wallet'),
        renderCell: ({ address }) => (
          <span className="inline-flex rounded-lg bg-[linear-gradient(135deg,#FFECE3,#6D4637,#674031)] p-px">
            <span className="flex items-center gap-x-2 rounded-[7px] bg-background px-3 py-3">
              <img src={primeLogoSrc} alt="" className="h-5 shrink-0" />

              <Username address={address} className="text-b1s text-white" />
            </span>
          </span>
        ),
      },
      {
        key: 'totalRewards',
        label: t('primeLeaderboard.rewardTable.columns.totalRewards'),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.totalRewards'),
        align: 'right',
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.totalRewardsCents - rowB.totalRewardsCents
            : rowB.totalRewardsCents - rowA.totalRewardsCents,
        renderCell: ({ totalRewardsCents }) => (
          <span className="text-b1r text-white">
            {formatCentsToReadableValue({ value: totalRewardsCents })}
          </span>
        ),
      },
      {
        key: 'usdtRewards',
        label: t('primeLeaderboard.rewardTable.columns.marketRewards', { symbol: 'USDT' }),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.marketRewards', {
          symbol: 'USDT',
        }),
        align: 'right',
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.usdtRewardsCents - rowB.usdtRewardsCents
            : rowB.usdtRewardsCents - rowA.usdtRewardsCents,
        renderCell: ({ usdtRewardsCents }) => (
          <span className="text-b1r text-white">
            {formatCentsToReadableValue({ value: usdtRewardsCents })}
          </span>
        ),
      },
      {
        key: 'uRewards',
        label: t('primeLeaderboard.rewardTable.columns.marketRewards', { symbol: 'U' }),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.marketRewards', { symbol: 'U' }),
        align: 'right',
        sortRows: (rowA, rowB, direction) =>
          direction === 'asc'
            ? rowA.uRewardsCents - rowB.uRewardsCents
            : rowB.uRewardsCents - rowA.uRewardsCents,
        renderCell: ({ uRewardsCents }) => (
          <span className="text-b1r text-white">
            {formatCentsToReadableValue({ value: uRewardsCents })}
          </span>
        ),
      },
    ],
    [t],
  );

  const defaultSortColumn = columns.find(column => column.key === 'totalRewards');

  const pageRewards = placeholderRewards.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <Table
        variant="primary"
        className="border-0 p-0"
        columns={columns}
        data={pageRewards}
        rowKeyExtractor={row => `prime-reward-table-row-${row.id}`}
        initialOrder={defaultSortColumn && { orderBy: defaultSortColumn, orderDirection: 'desc' }}
      />

      <Pagination
        itemsCount={placeholderRewards.length}
        itemsPerPageCount={ITEMS_PER_PAGE}
        paramKey={REWARDS_PAGE_PARAM_KEY}
        onChange={setCurrentPage}
      />
    </div>
  );
};
