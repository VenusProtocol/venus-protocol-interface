import { WalletClient } from '@wagmi/core';
import { providers } from 'ethers';

// Convert a viem Wallet Client to an ethers.js Signer
const getSigner = ({ walletClient }: { walletClient?: WalletClient } = {}) => {
  if (!walletClient) {
    return undefined;
  }

  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
};

export default getSigner;
