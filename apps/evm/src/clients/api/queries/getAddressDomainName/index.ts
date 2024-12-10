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
      addresses: JSON.stringify(addresses),
      chainIds: chainIds ? JSON.stringify(chainIds) : undefined,
    },
  });

  if (response.data && 'error' in response.data) {
    throw new Error(response.data.error);
  }

  return response.data;
};

const domainNamesBatcher = create({
  fetcher: async (queries: { accountAddress: Address }[]) =>
    getDomainNameFromApi({
      addresses: queries.map(q => q.accountAddress),
    }),
  resolver: (data, query) => data?.[query.accountAddress],
  scheduler: windowScheduler(10),
});

type ChainIdDomainNameMap = { [Key in ChainId]?: string | null };
type GetApiDomainNameResponse = Record<Address, ChainIdDomainNameMap>;

export interface GetAddressDomainNameInput {
  accountAddress: Address;
  chainId: ChainId;
  useBatching?: boolean;
}

export type GetAddressDomainNameOutput = ChainIdDomainNameMap;

const getAddressDomainName = async ({
  accountAddress,
  chainId,
  useBatching = true,
}: GetAddressDomainNameInput) => {
  const response = !useBatching
    ? (
        await getDomainNameFromApi({
          addresses: [accountAddress],
          chainIds: [chainId],
        })
      )?.[accountAddress]
    : await domainNamesBatcher.fetch({ accountAddress });

  return response || {};
};

export default getAddressDomainName;
