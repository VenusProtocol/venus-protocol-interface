import { createWeb3Name } from '@web3-name-sdk/core';
import config from 'config';
import { ChainId } from 'types';

export interface GetAddressDomainNameInput {
  accountAddress: string;
  chainId: ChainId;
}

export type GetAddressDomainNameOutput = Awaited<ReturnType<typeof web3Name.getDomainName>> | null;

// the client will query the VerifiedTldHub contract on Ethereum
// to fetch TLD medatada
const web3Name = createWeb3Name({
  rpcUrl: config.rpcUrls[ChainId.ETHEREUM],
});

const getAddressDomainName = async ({
  accountAddress,
  chainId,
}: GetAddressDomainNameInput): Promise<GetAddressDomainNameOutput> => {
  const rpcUrl = config.rpcUrls[chainId];

  const addressDomainName = await web3Name.getDomainName({
    address: accountAddress,
    rpcUrl,
  });

  return addressDomainName;
};

export default getAddressDomainName;
