import { useMemo, useState } from 'react';
import type { Address } from 'viem';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import {
  type PrimeRewardsLeaderboardEntry,
  useGetPrimeCurrentCycle,
  useGetPrimeRewardsLeaderboard,
} from 'clients/api';
import { type Order, type TableColumn, Username } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  areAddressesEqual,
  compareTokensBySymbol,
  convertUsdMantissaToCents,
  findTokenByAddress,
  formatCentsToReadableValue,
} from 'utilities';

import { ITEMS_PER_PAGE, PrimeLeaderboardTable } from '../PrimeLeaderboardTable';

const REWARDS_PAGE_PARAM_KEY = 'rewardsPage';

export interface RewardTableProps {
  className?: string;
}

export const RewardTable: React.FC<RewardTableProps> = ({ className }) => {
  const { t } = useTranslation();
  const tokens = useGetTokens();
  const { accountAddress } = useAccountAddress();
  const { currentPage, setCurrentPage } = useUrlPagination({ paramKey: REWARDS_PAGE_PARAM_KEY });

  const [sort, setSort] = useState<{ sortBy: 'total' | Address; order: 'asc' | 'desc' }>({
    sortBy: 'total',
    order: 'desc',
  });

  const { data: currentCycle } = useGetPrimeCurrentCycle();
  const { data, isLoading } = useGetPrimeRewardsLeaderboard({
    page: currentPage + 1,
    limit: ITEMS_PER_PAGE,
    sortBy: sort.sortBy,
    order: sort.order,
  });

  const rewardTokens = useMemo(
    () =>
      (currentCycle?.pendingPool?.byRewardToken ?? [])
        .flatMap(({ rewardTokenAddress }) => {
          const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
          return token ? [token] : [];
        })
        .sort(compareTokensBySymbol),
    [currentCycle, tokens],
  );

  const columns: TableColumn<PrimeRewardsLeaderboardEntry>[] = useMemo(
    () => [
      {
        key: 'wallet',
        label: t('primeLeaderboard.rewardTable.columns.wallet'),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.wallet'),
        renderCell: ({ userAddress }) => (
          <div className="flex items-center gap-x-3">
            <span className="inline-flex rounded-lg bg-[linear-gradient(135deg,#FFECE3,#6D4637,#674031)] p-px">
              <span className="flex min-w-[130px] items-center gap-x-2 rounded-[7px] bg-background px-3 py-3">
                <img src={primeLogoSrc} alt="" className="h-5 shrink-0" />

                <Username address={userAddress} className="text-b1s text-white" />
              </span>
            </span>

            {accountAddress && areAddressesEqual(userAddress, accountAddress) && (
              <span className="size-2 shrink-0 rounded-full bg-blue" />
            )}
          </div>
        ),
      },
      {
        key: 'total',
        label: t('primeLeaderboard.rewardTable.columns.totalRewards'),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.totalRewards'),
        align: 'right',
        sortable: true,
        renderCell: ({ totalCurrentCycleUsdMantissa }) => (
          <span className="text-b1r text-white">
            {formatCentsToReadableValue({
              value: convertUsdMantissaToCents(totalCurrentCycleUsdMantissa).toNumber(),
            })}
          </span>
        ),
      },
      ...rewardTokens.map<TableColumn<PrimeRewardsLeaderboardEntry>>(token => ({
        key: token.address,
        label: t('primeLeaderboard.rewardTable.columns.marketRewards', { symbol: token.symbol }),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.marketRewards', {
          symbol: token.symbol,
        }),
        align: 'right',
        sortable: true,
        renderCell: ({ byRewardToken }) => {
          const reward = byRewardToken.find(({ rewardTokenAddress }) =>
            areAddressesEqual(rewardTokenAddress, token.address),
          );

          return (
            <span className="text-b1r text-white">
              {formatCentsToReadableValue({
                value: reward
                  ? convertUsdMantissaToCents(reward.currentCycleUsdMantissa).toNumber()
                  : 0,
              })}
            </span>
          );
        },
      })),
    ],
    [t, rewardTokens, accountAddress],
  );

  const orderBy = columns.find(column => column.key === sort.sortBy);
  const order = orderBy && { orderBy, orderDirection: sort.order };

  const handleOrderChange = ({
    orderBy: column,
    orderDirection,
  }: Order<PrimeRewardsLeaderboardEntry>) => {
    setSort({
      sortBy: column.key === 'total' ? 'total' : (column.key as Address),
      order: orderDirection,
    });
    setCurrentPage(0);
  };

  return (
    <PrimeLeaderboardTable
      columns={columns}
      data={data?.entries ?? []}
      itemsCount={data?.total ?? 0}
      pageParamKey={REWARDS_PAGE_PARAM_KEY}
      rowKeyExtractor={row => `prime-reward-table-row-${row.userAddress}`}
      isFetching={isLoading}
      controls
      order={order}
      onOrderChange={handleOrderChange}
      tableLayout="auto"
      breakpoint="sm"
      hideCardDelimiter
      className={className}
    />
  );
};
