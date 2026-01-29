import { NATIVE_TOKEN_ADDRESS } from '../../constants';
import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';

type TokenMapping<C extends ChainId[]> = Record<C[number], Token>;

const generateTokenMapping = <C extends ChainId[]>({
  sharedTokenProps,
  chainIds,
}: {
  sharedTokenProps: Omit<Token, 'chainId'>;
  chainIds: C;
}) =>
  chainIds.reduce<TokenMapping<C>>(
    (acc, chainId) => {
      const token: Token = {
        ...sharedTokenProps,
        chainId,
      };

      return {
        ...acc,
        [chainId]: token,
      };
    },
    {} as TokenMapping<C>,
  );

export const eth = generateTokenMapping({
  sharedTokenProps: {
    address: NATIVE_TOKEN_ADDRESS,
    decimals: 18,
    symbol: 'ETH',
    iconSrc: iconSrcs.eth,
    isNative: true,
  },
  chainIds: [
    ChainId.ETHEREUM,
    ChainId.SEPOLIA,
    ChainId.ARBITRUM_ONE,
    ChainId.ARBITRUM_SEPOLIA,
    ChainId.ZKSYNC_MAINNET,
    ChainId.ZKSYNC_SEPOLIA,
    ChainId.OPTIMISM_MAINNET,
    ChainId.OPTIMISM_SEPOLIA,
    ChainId.BASE_MAINNET,
    ChainId.BASE_SEPOLIA,
    ChainId.UNICHAIN_MAINNET,
    ChainId.UNICHAIN_SEPOLIA,
  ],
});

export const bnb = generateTokenMapping({
  sharedTokenProps: {
    address: NATIVE_TOKEN_ADDRESS,
    decimals: 18,
    symbol: 'BNB',
    iconSrc: iconSrcs.bnb,
    isNative: true,
  },
  chainIds: [
    ChainId.BSC_MAINNET,
    ChainId.BSC_TESTNET,
    ChainId.OPBNB_TESTNET,
    ChainId.OPBNB_MAINNET,
  ],
});
