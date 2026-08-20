import { useMemo, useRef, useState } from 'react';

import {
  type ApiRiskDashboardWallet,
  type RiskDashboardWalletsOrderBy,
  type RiskDashboardWalletsRiskStatus,
  useGetRiskDashboardWallets,
} from 'clients/api';
import {
  HealthFactorPill,
  ImgGroup,
  type Order,
  Pagination,
  Table,
  type TableColumn,
  Username,
} from 'components';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { getAddress } from 'viem';

export const WALLETS_PAGE_PARAM_KEY = 'walletsPage';
const ITEMS_PER_PAGE = 50;
const MS_PER_DAY = 86_400_000;

const ORDER_BY_KEYS: RiskDashboardWalletsOrderBy[] = [
  'supply',
  'collateral',
  'borrow',
  'healthFactor',
  'badDebt',
  'badDebtDuration',
];

const isOrderByKey = (key: string): key is RiskDashboardWalletsOrderBy =>
  ORDER_BY_KEYS.some(orderByKey => orderByKey === key);

const formatBadDebtDuration = (startedAt: string | null, isFloor: boolean) => {
  if (!startedAt) {
    return '-';
  }
  const days = Math.floor((Date.now() - new Date(startedAt).getTime()) / MS_PER_DAY);
  const readable = days >= 1 ? `${days}d` : '<1d';
  return isFloor ? `≥ ${readable}` : readable;
};

const formatUsdCents = (cents: string) => formatCentsToReadableValue({ value: Number(cents) });

export interface WalletsTableProps {
  riskStatus?: RiskDashboardWalletsRiskStatus;
  marketAddresses: string[];
  suppliedMarketAddresses: string[];
  borrowedMarketAddresses: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const WalletsTable: React.FC<WalletsTableProps> = ({
  riskStatus,
  marketAddresses,
  suppliedMarketAddresses,
  borrowedMarketAddresses,
  currentPage,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [orderBy, setOrderBy] = useState<RiskDashboardWalletsOrderBy>('supply');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useGetRiskDashboardWallets({
    page: currentPage + 1,
    limit: ITEMS_PER_PAGE,
    orderBy,
    order,
    riskStatus,
    marketAddresses,
    suppliedMarketAddresses,
    borrowedMarketAddresses,
  });
  const wallets = data?.wallets ?? [];

  const vTokens = useGetVTokens();
  const marketIconByAddress = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    for (const vToken of vTokens) {
      map[getAddress(vToken.address)] = vToken.underlyingToken.iconSrc;
    }
    return map;
  }, [vTokens]);

  const columns: TableColumn<ApiRiskDashboardWallet>[] = [
    {
      key: 'wallet',
      label: t('statsPage.walletsTable.columns.wallet'),
      selectOptionLabel: t('statsPage.walletsTable.columns.wallet'),
      renderCell: wallet => (
        <Username address={getAddress(wallet.address)} className="text-b1r text-white" />
      ),
    },
    {
      key: 'supply',
      label: t('statsPage.walletsTable.columns.supply'),
      selectOptionLabel: t('statsPage.walletsTable.columns.supply'),
      align: 'right',
      sortable: true,
      renderCell: wallet => formatUsdCents(wallet.totalSupplyUsdCents),
    },
    {
      key: 'collateral',
      label: t('statsPage.walletsTable.columns.collateral'),
      selectOptionLabel: t('statsPage.walletsTable.columns.collateral'),
      align: 'right',
      sortable: true,
      renderCell: wallet => formatUsdCents(wallet.totalCollateralUsdCents),
    },
    {
      key: 'borrow',
      label: t('statsPage.walletsTable.columns.borrow'),
      selectOptionLabel: t('statsPage.walletsTable.columns.borrow'),
      align: 'right',
      sortable: true,
      renderCell: wallet => formatUsdCents(wallet.totalBorrowUsdCents),
    },
    {
      key: 'healthFactor',
      label: t('statsPage.walletsTable.columns.healthFactor'),
      selectOptionLabel: t('statsPage.walletsTable.columns.healthFactor'),
      align: 'right',
      sortable: true,
      renderCell: wallet =>
        Number(wallet.totalBorrowUsdCents) > 0 ? (
          <HealthFactorPill factor={Number(wallet.healthFactorMantissa) / 1e18} showLabel />
        ) : (
          '-'
        ),
    },
    {
      key: 'badDebt',
      label: t('statsPage.walletsTable.columns.badDebt'),
      selectOptionLabel: t('statsPage.walletsTable.columns.badDebt'),
      align: 'right',
      sortable: true,
      renderCell: wallet => formatUsdCents(wallet.badDebtUsdCents),
    },
    {
      key: 'badDebtDuration',
      label: t('statsPage.walletsTable.columns.badDebtDuration'),
      selectOptionLabel: t('statsPage.walletsTable.columns.badDebtDuration'),
      align: 'right',
      sortable: true,
      renderCell: wallet =>
        formatBadDebtDuration(wallet.badDebtStartedAt, wallet.badDebtStartedAtIsFloor),
    },
    {
      key: 'suppliedAssets',
      label: t('statsPage.walletsTable.columns.suppliedAssets'),
      selectOptionLabel: t('statsPage.walletsTable.columns.suppliedAssets'),
      renderCell: wallet => {
        const iconSrcs = wallet.positions
          .filter(position => Number(position.supplyUsdCents) > 0)
          .map(position => marketIconByAddress[getAddress(position.marketAddress)])
          .filter((iconSrc): iconSrc is string => Boolean(iconSrc));
        return iconSrcs.length > 0 ? (
          <ImgGroup imgSrcs={iconSrcs} removeDuplicates limit={8} />
        ) : (
          '-'
        );
      },
    },
  ];

  const orderByColumn = columns.find(column => column.key === orderBy);
  const tableOrder = orderByColumn && { orderBy: orderByColumn, orderDirection: order };

  const handleOrderChange = ({
    orderBy: column,
    orderDirection,
  }: Order<ApiRiskDashboardWallet>) => {
    if (!isOrderByKey(column.key)) {
      return;
    }
    setOrderBy(column.key);
    setOrder(orderDirection);
    onPageChange(0);
  };

  return (
    <div ref={containerRef} className="flex flex-1 flex-col justify-between">
      <Table
        variant="primary"
        columns={columns}
        data={wallets}
        isFetching={isLoading}
        rowKeyExtractor={wallet => `wallets-table-row-${wallet.address}`}
        order={tableOrder}
        onOrderChange={handleOrderChange}
        placeholder={
          !isLoading && wallets.length === 0 ? t('statsPage.walletsTable.noData') : undefined
        }
      />

      <Pagination
        itemsCount={data?.total ?? 0}
        itemsPerPageCount={ITEMS_PER_PAGE}
        paramKey={WALLETS_PAGE_PARAM_KEY}
        onChange={onPageChange}
        scrollToRef={containerRef}
      />
    </div>
  );
};
