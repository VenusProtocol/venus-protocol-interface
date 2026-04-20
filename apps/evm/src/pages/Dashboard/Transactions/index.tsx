import { useGetAccountTransactionHistory, useGetPools } from 'clients/api';
import {
  Pagination,
  Select,
  type SelectOption,
  TokenIconWithSymbol,
  TransactionsList,
} from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { MARKET_TX_TYPES, TX_TYPES } from 'constants/marketTxTypes';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { getTransactionName } from 'utilities';
import { type Address, isAddress } from 'viem';

const FIRST_PAGE = 1;
const ITEMS_PER_PAGE_COUNT = 20;
const ALL_OPTION_VALUE = 'all';
const PAGE_PARAM_KEY = 'page';
const TX_TYPE_PARAM_KEY = 'txType';
const CONTRACT_ADDRESS_PARAM_KEY = 'contractAddress';

export const Transactions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { chainId } = useChainId();

  const pageStr = searchParams.get(PAGE_PARAM_KEY);
  const pageNumber = pageStr ? Number(pageStr) : FIRST_PAGE;
  const page = !Number.isNaN(pageNumber) ? pageNumber : undefined;

  const txTypeStr = searchParams.get(TX_TYPE_PARAM_KEY) ?? ALL_OPTION_VALUE;
  const txType = TX_TYPES.find(type => type === txTypeStr);
  const selectedTxType = txType ?? ALL_OPTION_VALUE;

  const selectedContractAddress = searchParams.get(CONTRACT_ADDRESS_PARAM_KEY)
    ? (searchParams.get(CONTRACT_ADDRESS_PARAM_KEY) as Address)
    : ALL_OPTION_VALUE;

  const setTxType = (newTxType: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [TX_TYPE_PARAM_KEY]: newTxType,
      // Reset page
      [PAGE_PARAM_KEY]: String(FIRST_PAGE),
    }));

  const setSelectedContractAddress = (newContractAddress: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [CONTRACT_ADDRESS_PARAM_KEY]: newContractAddress,
      // Reset page
      [PAGE_PARAM_KEY]: String(FIRST_PAGE),
    }));

  const setPage = (newPage: string) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [PAGE_PARAM_KEY]: newPage,
    }));

  // Reset search params when detecting chain switch.
  const chainIdRef = useRef(chainId);
  useEffect(() => {
    if (chainId !== chainIdRef.current) {
      setSearchParams(currentSearchParams => ({
        ...Object.fromEntries(currentSearchParams),
        [TX_TYPE_PARAM_KEY]: ALL_OPTION_VALUE,
        [CONTRACT_ADDRESS_PARAM_KEY]: ALL_OPTION_VALUE,
        [PAGE_PARAM_KEY]: ALL_OPTION_VALUE,
      }));

      chainIdRef.current = chainId;
    }
  }, [chainId, setSearchParams]);

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
        contractAddress: isAddress(selectedContractAddress) ? selectedContractAddress : undefined,
        type: txType,
      },
      {
        enabled: !!accountAddress && isTransactionHistoryFeatureEnabled,
      },
    );

  const txTypeSelectOptions = useMemo(() => {
    const allOption: SelectOption<string> = {
      label: t('account.transactions.selects.txType.all'),
      value: ALL_OPTION_VALUE,
    };

    const otherOptions: SelectOption<string>[] = MARKET_TX_TYPES.map(type => ({
      label: getTransactionName({
        txType: type,
        t,
      }),
      value: type,
    }));

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
        chainId: a.vToken.chainId,
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

  // Reset contract address filter if the value in the URL is incorrect
  useEffect(() => {
    if (!sourceSelectOptions.find(option => option.value === selectedContractAddress)) {
      setSearchParams(currentSearchParams => {
        currentSearchParams.delete(CONTRACT_ADDRESS_PARAM_KEY);

        return Object.fromEntries(currentSearchParams);
      });
    }
  }, [selectedContractAddress, sourceSelectOptions, setSearchParams]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {accountAddress && (
        <div className="flex flex-row gap-3 md:gap-4">
          <Select
            className="flex-1 md:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={txTypeSelectOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey"
            buttonClassName="min-w-1/2 sm:min-w-45"
            value={selectedTxType}
            onChange={newValue => setTxType(newValue.toString())}
          />

          <Select
            className="flex-1 md:flex-none"
            size="small"
            variant="tertiary"
            placeLabelToLeft
            options={sourceSelectOptions}
            optionClassName="px-3 h-10 scrollbar-track-cards"
            dropdownClassName="overflow-y-auto max-h-70 scrollbar-thin scrollbar-track-cards scrollbar-thumb-grey sm:min-w-68"
            buttonClassName="m-w-1/2 sm:min-w-45"
            value={selectedContractAddress}
            onChange={newValue => setSelectedContractAddress(newValue.toString())}
          />
        </div>
      )}

      <TransactionsList
        transactions={historicalTxsData?.transactions || []}
        isLoading={areHistoricalTxsLoading}
      />

      {!areHistoricalTxsLoading && (
        <Pagination
          initialPageIndex={FIRST_PAGE}
          itemsCount={historicalTxsData?.count || 0}
          itemsPerPageCount={ITEMS_PER_PAGE_COUNT}
          onChange={newValue => setPage(newValue.toString())}
        />
      )}
    </div>
  );
};
