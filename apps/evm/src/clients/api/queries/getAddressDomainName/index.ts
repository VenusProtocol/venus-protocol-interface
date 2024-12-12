import { create, windowScheduler } from '@yornaath/batshit';
import type { ChainId } from 'types';
import { restService } from 'utilities';
import type { Address } from 'viem';

const getDomainNameFromApi = async ({
  addresses,
  chainIds,
}: { addresses: Address[]; chainIds?: ChainId[] }) => {
  const response = await restService<GetApiDomainNameResponse>({
    endpoint: '/web3-domain-name',
    method: 'GET',
    params: {
      addresses: JSON.stringify([...new Set(addresses)]),
      chainIds: JSON.stringify([...new Set(chainIds)]),
    },
  });

  if (response.data && 'error' in response.data) {
    throw new Error(response.data.error);
  }

  return response.data;
};

const domainNamesBatcher = create({
  fetcher: async (queries: { accountAddress: Address; chainId: ChainId }[]) =>
    getDomainNameFromApi({
      addresses: queries.map(q => q.accountAddress),
      chainIds: queries.map(q => q.chainId),
    }),
  resolver: (data, query) => data?.[query.accountAddress],
  scheduler: windowScheduler(10),
});

type ChainIdDomainNameMap = { [Key in ChainId]?: string | null };
type GetApiDomainNameResponse = Record<Address, ChainIdDomainNameMap>;

export interface GetAddressDomainNameInput {
  accountAddress: Address;
  chainId: ChainId;
}

export type GetAddressDomainNameOutput = ChainIdDomainNameMap;

const getAddressDomainName = async ({ accountAddress, chainId }: GetAddressDomainNameInput) => {
  const response = await domainNamesBatcher.fetch({ accountAddress, chainId });

  return response || {};
};

export default getAddressDomainName;
