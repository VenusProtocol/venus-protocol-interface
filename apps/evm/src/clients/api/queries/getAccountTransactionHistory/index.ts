import { VError } from 'libs/errors';
import type { VToken } from 'types';
import { restService } from 'utilities';
import { type Address, isAddress } from 'viem';
import { formatApiTransaction } from './formatApiTransaction';
import type {
  AccountTransactionHistoryApiResponse,
  GetAccountTransactionHistoryInput,
  GetAccountTransactionHistoryOutput,
} from './types';

export * from './types';

export const getAccountTransactionHistory = async ({
  chainId,
  accountAddress,
  contractAddress,
  getPoolsData,
  type,
  page,
}: GetAccountTransactionHistoryInput): Promise<GetAccountTransactionHistoryOutput> => {
  const txsResponse = await restService<AccountTransactionHistoryApiResponse>({
    endpoint: `/account/${accountAddress}/transactions`,
    method: 'GET',
    params: {
      chainId,
      type,
      contractAddress: isAddress(contractAddress) ? contractAddress : undefined,
      page,
    },
  });

  if (txsResponse.data && 'error' in txsResponse.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: txsResponse.data.error },
    });
  }

  if (!txsResponse.data) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const allAssets =
    getPoolsData?.pools.flatMap(p =>
      p.assets.map(a => ({
        ...a,
        poolName: p.name,
      })),
    ) || [];

  const contractToTokenMap = allAssets.reduce<
    Record<Address, { vToken: VToken; poolName: string }>
  >((acc, a) => {
    const { poolName, vToken } = a;

    return {
      ...acc,
      [vToken.address.toLowerCase()]: {
        poolName,
        vToken,
      },
    };
  }, {});

  const formattedResponse = txsResponse.data.results.map(apiTransaction =>
    formatApiTransaction({
      contractToTokenMap,
      apiTransaction,
    }),
  );

  return {
    count: Number(txsResponse.data.count),
    transactions: formattedResponse,
  };
};
