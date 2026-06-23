import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { type PrimeLeaderboardEntry, useGetPrimeLeaderboard } from 'clients/api';
import { InfoIcon, type TableColumn, Username } from 'components';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { areAddressesEqual, convertMantissaToTokens, shortenValueWithSuffix } from 'utilities';

import { ITEMS_PER_PAGE, PrimeLeaderboardTable } from '../PrimeLeaderboardTable';
import { RankBadge } from './RankBadge';

const RANKS_PAGE_PARAM_KEY = 'ranksPage';

export interface RankTableProps {
  className?: string;
}

export const RankTable: React.FC<RankTableProps> = ({ className }) => {
  const { t } = useTranslation();
  const xvs = useGetToken({ symbol: 'XVS' });
  const { accountAddress } = useAccountAddress();
  const { currentPage } = useUrlPagination({ paramKey: RANKS_PAGE_PARAM_KEY });

  const { data, isLoading } = useGetPrimeLeaderboard({
    page: currentPage + 1,
    limit: ITEMS_PER_PAGE,
  });
  const entries = data?.entries ?? [];

  const columns: TableColumn<PrimeLeaderboardEntry>[] = useMemo(
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
        renderCell: ({ rank, userAddress }) => (
          <div className="flex items-center gap-x-2">
            {rank <= 3 && <RankBadge rank={rank} />}

            <span className="text-b1r text-white">#{rank}</span>

            <Username address={userAddress} className="text-b1r text-light-grey" />

            {accountAddress && areAddressesEqual(userAddress, accountAddress) && (
              <span className="size-2 shrink-0 rounded-full bg-blue" />
            )}
          </div>
        ),
      },
      {
        key: 'primeScore',
        label: t('primeLeaderboard.rankTable.columns.primeScore'),
        selectOptionLabel: t('primeLeaderboard.rankTable.columns.primeScore'),
        align: 'right',
        renderCell: ({ effectiveStakeMantissa }) => (
          <span className="text-b1r text-white">
            {shortenValueWithSuffix({
              value:
                convertMantissaToTokens({
                  value: new BigNumber(effectiveStakeMantissa),
                  token: xvs,
                }) ?? new BigNumber(0),
              maxDecimalPlaces: 2,
            })}
          </span>
        ),
      },
    ],
    [t, xvs, accountAddress],
  );

  return (
    <PrimeLeaderboardTable
      columns={columns}
      data={entries}
      itemsCount={data?.total ?? 0}
      pageParamKey={RANKS_PAGE_PARAM_KEY}
      rowKeyExtractor={row => `prime-rank-table-row-${row.rank}`}
      isFetching={isLoading}
      className={className}
    />
  );
};
