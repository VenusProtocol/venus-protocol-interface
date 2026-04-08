import { VError } from 'libs/errors';
import type { MarketTxType } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';
import { formatApiTransaction } from './formatApiTransaction';
import type {
  AccountTransactionHistoryApiResponse,
  GetAccountTransactionHistoryInput,
  GetAccountTransactionHistoryOutput,
  VTokenAssetMapping,
} from './types';

export * from './types';

export const MARKET_TX_TYPE_TO_API_FILTER: Record<MarketTxType, number> = {
  supply: 0,
  borrow: 1,
  withdraw: 2,
  repay: 3,
  enterMarket: 4,
  exitMarket: 5,
};

export const getAccountTransactionHistory = async ({
  chainId,
  accountAddress,
  contractAddress,
  positionAccountAddress,
  getPoolsData,
  type,
  page,
}: GetAccountTransactionHistoryInput): Promise<GetAccountTransactionHistoryOutput> => {
  const apiType =
    type && Object.prototype.hasOwnProperty.call(MARKET_TX_TYPE_TO_API_FILTER, type)
      ? MARKET_TX_TYPE_TO_API_FILTER[type as keyof typeof MARKET_TX_TYPE_TO_API_FILTER]
      : undefined;

  const txsResponse = await restService<AccountTransactionHistoryApiResponse>({
    endpoint: `/account/${accountAddress}/transactions`,
    method: 'GET',
    params: {
      chainId,
      type: apiType,
      contractAddress,
      positionAccountAddress,
      page,
    },
  });

  if (txsResponse.data && 'error' in txsResponse.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: txsResponse.data.error },
    });
  }

  if (!txsResponse.data) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const vTokenAssetMapping = (getPoolsData?.pools || []).reduce<VTokenAssetMapping>((acc, pool) => {
    pool.assets.forEach(asset => {
      acc[asset.vToken.address.toLowerCase() as Address] = {
        ...asset,
        poolName: pool.name,
      };
    });

    return acc;
  }, {});

  const formattedResponse = txsResponse.data.results.reduce<
    GetAccountTransactionHistoryOutput['transactions']
  >((acc, apiTransaction) => {
    const formattedTransaction = formatApiTransaction({
      vTokenAssetMapping,
      apiTransaction,
    });

    if (formattedTransaction) {
      acc.push(formattedTransaction);
    }

    return acc;
  }, []);

  return {
    count: Number(txsResponse.data.count),
    transactions: formattedResponse,
  };
};
