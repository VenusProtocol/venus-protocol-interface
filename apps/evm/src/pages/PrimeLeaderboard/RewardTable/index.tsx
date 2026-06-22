import { useMemo } from 'react';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import {
  type PrimeRewardsLeaderboardEntry,
  useGetPrimeCurrentCycle,
  useGetPrimeRewardsLeaderboard,
} from 'clients/api';
import { type TableColumn, Username } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual, findTokenByAddress, formatCentsToReadableValue } from 'utilities';

import { ITEMS_PER_PAGE, PrimeLeaderboardTable } from '../PrimeLeaderboardTable';

const REWARDS_PAGE_PARAM_KEY = 'rewardsPage';

export interface RewardTableProps {
  className?: string;
}

export const RewardTable: React.FC<RewardTableProps> = ({ className }) => {
  const { t } = useTranslation();
  const tokens = useGetTokens();
  const { accountAddress } = useAccountAddress();
  const { currentPage } = useUrlPagination({ paramKey: REWARDS_PAGE_PARAM_KEY });

  const { data: currentCycle } = useGetPrimeCurrentCycle();
  const { data, isLoading } = useGetPrimeRewardsLeaderboard({
    page: currentPage + 1,
    limit: ITEMS_PER_PAGE,
  });

  const rewardTokens = useMemo(
    () =>
      (currentCycle?.pendingPool?.byRewardToken ?? []).flatMap(({ rewardTokenAddress }) => {
        const token = findTokenByAddress({ address: rewardTokenAddress, tokens });
        return token ? [token] : [];
      }),
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
              <span className="flex items-center gap-x-2 rounded-[7px] bg-background px-3 py-3">
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
        key: 'totalRewards',
        label: t('primeLeaderboard.rewardTable.columns.totalRewards'),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.totalRewards'),
        align: 'right',
        renderCell: ({ totalPendingCents }) => (
          <span className="text-b1r text-white">
            {formatCentsToReadableValue({ value: Number(totalPendingCents) })}
          </span>
        ),
      },
      ...rewardTokens.map<TableColumn<PrimeRewardsLeaderboardEntry>>(token => ({
        key: `reward-${token.address}`,
        label: t('primeLeaderboard.rewardTable.columns.marketRewards', { symbol: token.symbol }),
        selectOptionLabel: t('primeLeaderboard.rewardTable.columns.marketRewards', {
          symbol: token.symbol,
        }),
        align: 'right',
        renderCell: ({ byRewardToken }) => {
          const reward = byRewardToken.find(({ rewardTokenAddress }) =>
            areAddressesEqual(rewardTokenAddress, token.address),
          );

          return (
            <span className="text-b1r text-white">
              {formatCentsToReadableValue({ value: reward ? Number(reward.pendingCents) : 0 })}
            </span>
          );
        },
      })),
    ],
    [t, rewardTokens, accountAddress],
  );

  return (
    <PrimeLeaderboardTable
      columns={columns}
      data={data?.entries ?? []}
      itemsCount={data?.total ?? 0}
      pageParamKey={REWARDS_PAGE_PARAM_KEY}
      rowKeyExtractor={row => `prime-reward-table-row-${row.userAddress}`}
      isFetching={isLoading}
      className={className}
    />
  );
};
