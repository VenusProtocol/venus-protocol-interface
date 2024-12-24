import type { Token, VToken } from 'types';
import type { Account, Chain, Client, Transport } from 'viem';
import { watchAsset } from 'viem/actions';
import { type Config, useConnectorClient } from 'wagmi';

export const useAddTokenToWallet = () => {
  const { data: walletClient } = useConnectorClient<Config>();

  const addTokenToWallet = async (token: Token | VToken) =>
    watchAsset(walletClient as Client<Transport, Chain, Account>, {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: `${window.location.origin}${token.asset}`,
      },
    });

  return {
    addTokenToWallet,
  };
};
