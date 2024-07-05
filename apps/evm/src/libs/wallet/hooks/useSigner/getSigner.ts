import { providers } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';

// Convert a viem Wallet Client to an ethers.js Signer
export const getSigner = ({
  walletClient,
}: {
  walletClient: Client<Transport, Chain, Account>;
}) => {
  const { account, chain, transport } = walletClient ?? {};

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
};
