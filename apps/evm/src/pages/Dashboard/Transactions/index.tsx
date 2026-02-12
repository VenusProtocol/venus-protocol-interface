import { useGetAccountTransactionHistory, useGetPools } from 'clients/api';
import { Pagination, Select, type SelectOption, Spinner, TokenIconWithSymbol } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { PAGE_PARAM_KEY } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useSearchParams } from 'react-router';
import { TxType } from 'types';
import { Placeholder } from '../Placeholder';
import { List } from './List';

const ALL_OPTION_VALUE = 'all';
const TX_TYPE_PARAM_KEY = 'txType';
const CONTRACT_ADDRESS_PARAM_KEY = 'contractAddress';
const INITIAL_PAGE_INDEX = 1;
const ITEMS_PER_PAGE_COUNT = 20;

export const Transactions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  let page = Number(searchParams.get(PAGE_PARAM_KEY));
  if (Number.isNaN(page)) {
    page = 1;
  }

  const txTypeStr = searchParams.get(TX_TYPE_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const txTypeNumber = Number(txTypeStr);
  const txType = !Number.isNaN(txTypeNumber) ? txTypeNumber : undefined;

  const selectedContractAddress = searchParams.get(CONTRACT_ADDRESS_PARAM_KEY) ?? ALL_OPTION_VALUE;

  const setTxType = (newTxType: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [TX_TYPE_PARAM_KEY]: newTxType,
    }));

  const setSelectedContractAddress = (newContractAddress: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [CONTRACT_ADDRESS_PARAM_KEY]: newContractAddress,
    }));

  const setPage = (newPage: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [PAGE_PARAM_KEY]: newPage,
    }));

  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { data: poolData } = useGetPools({
    accountAddress,
  });
  const isTransactionHistoryFeatureEnabled = useIsFeatureEnabled({
    name: 'transactionHistory',
  });
  const { data: accountTransactionHistoryData, isLoading: isGetAccountTransactionHistoryLoading } =
    useGetAccountTransactionHistory(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        page,
        contractAddress: selectedContractAddress,
        type: txType,
      },
      {
        enabled: !!accountAddress && isTransactionHistoryFeatureEnabled,
      },
    );

  const txTypeSelectOptions: SelectOption<string>[] = [
    {
      label: t('dashboard.transactions.selects.txType.all'),
      value: ALL_OPTION_VALUE,
    },
    {
      label: t('dashboard.transactions.selects.txType.mint'),
      value: TxType.Mint,
    },
    {
      label: t('dashboard.transactions.selects.txType.borrow'),
      value: TxType.Borrow,
    },
    {
      label: t('dashboard.transactions.selects.txType.redeem'),
      value: TxType.Redeem,
    },
    {
      label: t('dashboard.transactions.selects.txType.repay'),
      value: TxType.Repay,
    },
    {
      label: t('dashboard.transactions.selects.txType.enterMarket'),
      value: TxType.EnterMarket,
    },
    {
      label: t('dashboard.transactions.selects.txType.exitMarket'),
      value: TxType.ExitMarket,
    },
    {
      label: t('dashboard.transactions.selects.txType.approve'),
      value: TxType.Approve,
    },
  ];

  const allAssets =
    poolData?.pools.flatMap(p =>
      p.assets.map(a => ({
        ...a,
        poolName: p.name,
      })),
    ) || [];

  const tokenOptions = allAssets
    .map(a => ({
      symbol: `${a.vToken.underlyingToken.symbol} - ${a.poolName}`,
      iconSrc: a.vToken.underlyingToken.iconSrc,
      address: a.vToken.address,
      decimals: a.vToken.decimals,
      chainId: a.vToken.chainId,
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const sourceSelectOptions: SelectOption<string>[] = [
    {
      label: t('dashboard.transactions.selects.source.all'),
      value: ALL_OPTION_VALUE,
    },
    ...tokenOptions.map(tokenOption => ({
      label: <TokenIconWithSymbol token={tokenOption} />,
      value: tokenOption.address,
    })),
  ];

  const transactions = accountTransactionHistoryData?.transactions || [];

  const transactionCount = accountTransactionHistoryData?.count || 0;

  if (isGetAccountTransactionHistoryLoading) {
    return <Spinner />;
  }

  if (transactions.length === 0) {
    return (
      <Placeholder
        iconName="transactionFile"
        title={t('dashboard.transactions.placeholder.title')}
      />
    );
  }

  return (
    <div className="space-y-6 sm:space-y-3">
      <div className="space-y-6 sm:p-6 sm:rounded-lg sm:space-y-10 sm:border sm:border-dark-blue-hover">
        <div className="flex gap-3">
          <Select
            className="flex-1 sm:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={txTypeSelectOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="min-w-45"
            value={txTypeStr}
            onChange={newValue => setTxType(newValue.toString())}
          />

          <Select
            className="flex-1 sm:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={sourceSelectOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-y-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="min-w-45"
            value={selectedContractAddress}
            onChange={newValue => setSelectedContractAddress(newValue.toString())}
          />
        </div>

        <List transactions={transactions} />
      </div>

      <Pagination
        initialPageIndex={INITIAL_PAGE_INDEX}
        itemsCount={transactionCount}
        itemsPerPageCount={ITEMS_PER_PAGE_COUNT}
        onChange={newValue => setPage(newValue.toString())}
      />
    </div>
  );
};
