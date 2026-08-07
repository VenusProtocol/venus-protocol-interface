import { VError } from 'libs/errors';
import type { TxType } from 'types';
import { restService } from 'utilities';
import { type Address, isAddress } from 'viem';
import { formatApiTransaction } from './formatApiTransaction';
import type {
  AccountTransactionHistoryApiResponse,
  GetAccountTransactionHistoryInput,
  GetAccountTransactionHistoryOutput,
  VTokenAssetMapping,
  VhTokenMapping,
} from './types';

export * from './types';

export const TX_TYPE_TO_API_FILTER: Partial<Record<TxType, number>> = {
  supply: 0,
  borrow: 1,
  withdraw: 2,
  repay: 3,
  enterMarket: 4,
  exitMarket: 5,
  hubSupply: 39,
  hubWithdraw: 40,
  hubSupplyFromCollateral: 41,
};

export const getAccountTransactionHistory = async ({
  chainId,
  accountAddress,
  contractAddress,
  positionAccountAddress,
  pools,
  liquidityHubs,
  type,
  page,
}: GetAccountTransactionHistoryInput): Promise<GetAccountTransactionHistoryOutput> => {
  const apiType =
    type && Object.prototype.hasOwnProperty.call(TX_TYPE_TO_API_FILTER, type)
      ? TX_TYPE_TO_API_FILTER[type]
      : undefined;

  const txsResponse = await restService<AccountTransactionHistoryApiResponse>({
    endpoint: `/account/${accountAddress}/transactions`,
    method: 'GET',
    params: {
      chainId,
      type: apiType,
      contractAddress: contractAddress && isAddress(contractAddress) ? contractAddress : undefined,
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

  const vTokenAssetMapping = (pools || []).reduce<VTokenAssetMapping>((acc, pool) => {
    pool.assets.forEach(asset => {
      acc[asset.vToken.address.toLowerCase() as Address] = {
        ...asset,
        poolName: pool.name,
      };
    });

    return acc;
  }, {});

  const vhTokenMapping = liquidityHubs.reduce<VhTokenMapping>((acc, liquidityHub) => {
    acc[liquidityHub.vhToken.address.toLowerCase() as Address] = liquidityHub.vhToken;

    return acc;
  }, {});

  const formattedResponse = txsResponse.data.results.reduce<
    GetAccountTransactionHistoryOutput['transactions']
  >((acc, apiTransaction) => {
    const formattedTransaction = formatApiTransaction({
      vTokenAssetMapping,
      vhTokenMapping,
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
