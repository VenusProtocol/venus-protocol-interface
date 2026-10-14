import type { Token, VToken, VhToken } from 'types';
import type { Account, Chain, Client, Transport } from 'viem';
import { watchAsset } from 'viem/actions';
import { type Config, useConnectorClient } from 'wagmi';

import { formatIconSrc } from './formatIconSrc';

export const useAddTokenToWallet = () => {
  const { data: walletClient } = useConnectorClient<Config>();

  const addTokenToWallet = async (token: Token | VToken | VhToken) =>
    watchAsset(walletClient as Client<Transport, Chain, Account>, {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: 'iconSrc' in token ? formatIconSrc({ iconSrc: token.iconSrc }) : undefined,
      },
    });

  return {
    addTokenToWallet,
  };
};
