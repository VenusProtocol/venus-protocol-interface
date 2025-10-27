import { useGetAccountTransactionHistory, useGetPools } from 'clients/api';
import { Select, type SelectOption, TokenIconWithSymbol } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { TxType } from 'types';
import { TransactionsList } from './TransactionsList';

const FIRST_PAGE = 1;
const ALL_OPTION_VALUE = 'all';
const PAGE_PARAM_KEY = 'page';
const TX_TYPE_PARAM_KEY = 'txType';
const CONTRACT_ADDRESS_PARAM_KEY = 'contractAddress';

// DO NOT REMOVE COMMENT: needed by i18next to extract translation key
// t('account.transactions.selects.txType.mint')
// t('account.transactions.selects.txType.repay')
// t('account.transactions.selects.txType.borrow')
// t('account.transactions.selects.txType.redeem')
// t('account.transactions.selects.txType.approve')
// t('account.transactions.selects.txType.exitMarket')
// t('account.transactions.selects.txType.enterMarket')

const getTxTypeOptionTranslationKey = (txType: TxType) => {
  switch (txType) {
    case TxType.Mint:
      return 'account.transactions.selects.txType.mint';
    case TxType.Repay:
      return 'account.transactions.selects.txType.repay';
    case TxType.Borrow:
      return 'account.transactions.selects.txType.borrow';
    case TxType.Redeem:
      return 'account.transactions.selects.txType.redeem';
    case TxType.Approve:
      return 'account.transactions.selects.txType.approve';
    case TxType.ExitMarket:
      return 'account.transactions.selects.txType.exitMarket';
    default:
      return 'account.transactions.selects.txType.enterMarket';
  }
};

export const Transactions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageStr = searchParams.get(PAGE_PARAM_KEY);
  const pageNumber = pageStr ? Number(pageStr) : FIRST_PAGE;
  const page = !Number.isNaN(pageNumber) ? pageNumber : undefined;

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
  const { data: historicalTxsData, isLoading: areHistoricalTxsLoading } =
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

  const txTypeSelectOptions = useMemo(() => {
    const allOption: SelectOption<string> = {
      label: t('account.transactions.selects.txType.all'),
      value: 'all',
    };

    const otherOptions: SelectOption<string>[] = [];

    let value = 0;
    for (const typeStr in TxType) {
      if (typeStr) {
        otherOptions.push({
          label: t(getTxTypeOptionTranslationKey(TxType[typeStr as keyof typeof TxType])),
          value: value.toString(),
        });
        value++;
      }
    }

    return [allOption, ...otherOptions];
  }, [t]);

  const sourceSelectOptions = useMemo(() => {
    const allOption: SelectOption<string> = {
      label: t('account.transactions.selects.source.all'),
      value: ALL_OPTION_VALUE,
    };

    const allAssets =
      poolData?.pools.flatMap(p =>
        p.assets.map(a => ({
          ...a,
          poolName: p.name,
        })),
      ) || [];

    const otherOptions: SelectOption<string>[] = [];
    const tokenOptions = allAssets
      .map(a => ({
        symbol: `${a.vToken.underlyingToken.symbol} - ${a.poolName}`,
        iconSrc: a.vToken.underlyingToken.iconSrc,
        address: a.vToken.address,
        decimals: a.vToken.decimals,
      }))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));

    for (const tokenOption of tokenOptions) {
      otherOptions.push({
        label: <TokenIconWithSymbol token={tokenOption} />,
        value: tokenOption.address,
      });
    }

    return [allOption, ...otherOptions];
  }, [t, poolData]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row gap-3 md:gap-4">
        <Select
          className="flex-1 md:flex-none"
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
          className="flex-1 md:flex-none"
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

      <TransactionsList
        transactions={historicalTxsData?.transactions || []}
        isLoading={areHistoricalTxsLoading}
        transactionsCount={historicalTxsData?.count || 0}
        onPageChange={newValue => setPage(newValue.toString())}
      />
    </div>
  );
};
