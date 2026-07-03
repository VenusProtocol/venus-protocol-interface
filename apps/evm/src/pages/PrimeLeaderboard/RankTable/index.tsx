import BigNumber from 'bignumber.js';
import { useMemo, useState } from 'react';

import { type PrimeLeaderboardEntry, useGetPrimeLeaderboard } from 'clients/api';
import { InfoIcon, type Order, type TableColumn, Username } from 'components';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useUrlPagination } from 'hooks/useUrlPagination';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import {
  areAddressesEqual,
  convertMantissaToTokens,
  generateExplorerUrl,
  shortenValueWithSuffix,
} from 'utilities';

import { ITEMS_PER_PAGE, PrimeLeaderboardTable } from '../PrimeLeaderboardTable';
import { RankBadge } from './RankBadge';

export const RANKS_PAGE_PARAM_KEY = 'ranksPage';

export interface RankTableProps {
  className?: string;
}

export const RankTable: React.FC<RankTableProps> = ({ className }) => {
  const { t, Trans } = useTranslation();
  const xvs = useGetToken({ symbol: 'XVS' });
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const { address: primeV2Address } = useGetContractAddress({ name: 'PrimeV2' });
  const { currentPage, setCurrentPage } = useUrlPagination({ paramKey: RANKS_PAGE_PARAM_KEY });

  const rankVerificationUrl = primeV2Address
    ? generateExplorerUrl({ hash: primeV2Address, chainId })
    : undefined;

  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useGetPrimeLeaderboard({
    page: currentPage + 1,
    limit: ITEMS_PER_PAGE,
    order,
  });
  const entries = data?.entries ?? [];

  const columns: TableColumn<PrimeLeaderboardEntry>[] = useMemo(
    () => [
      {
        key: 'wallet',
        label: (
          <span className="inline-flex items-center gap-x-2">
            {t('primeLeaderboard.rankTable.columns.wallet')}
            <InfoIcon
              tooltip={
                <Trans
                  i18nKey="primeLeaderboard.rankTable.walletTooltip"
                  components={{
                    BscScan: (
                      // biome-ignore lint/a11y/useAnchorContent: content is provided by Trans
                      <a
                        href={rankVerificationUrl}
                        className="text-blue underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                />
              }
            />
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
        sortable: true,
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
    [t, Trans, xvs, accountAddress, rankVerificationUrl],
  );

  const orderBy = columns.find(column => column.key === 'primeScore');
  const tableOrder = orderBy && { orderBy, orderDirection: order };

  const handleOrderChange = ({ orderDirection }: Order<PrimeLeaderboardEntry>) => {
    setOrder(orderDirection);
    setCurrentPage(0);
  };

  return (
    <PrimeLeaderboardTable
      columns={columns}
      data={entries}
      itemsCount={data?.total ?? 0}
      pageParamKey={RANKS_PAGE_PARAM_KEY}
      rowKeyExtractor={row => `prime-rank-table-row-${row.rank}`}
      isFetching={isLoading}
      order={tableOrder}
      onOrderChange={handleOrderChange}
      className={className}
    />
  );
};
