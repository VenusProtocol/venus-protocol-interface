import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { bnb } from '../nativeTokens';

export const opBnbTestnet: Token[] = [
  bnb[ChainId.OPBNB_TESTNET],
  {
    chainId: ChainId.OPBNB_TESTNET,
    address: '0xc2931B1fEa69b6D6dA65a50363A8D75d285e4da9',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.OPBNB_TESTNET,
    address: '0x94680e003861D43C6c0cf18333972312B6956FF1',
    decimals: 18,
    symbol: 'ETH',
    iconSrc: iconSrcs.eth,
  },
  {
    chainId: ChainId.OPBNB_TESTNET,
    address: '0x8ac9B3801D0a8f5055428ae0bF301CA1Da976855',
    decimals: 18,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    chainId: ChainId.OPBNB_TESTNET,
    symbol: 'WBNB',
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
    iconSrc: iconSrcs.wbnb,
    tokenWrapped: bnb[ChainId.OPBNB_TESTNET],
  },
  {
    chainId: ChainId.OPBNB_TESTNET,
    symbol: 'BTCB',
    decimals: 18,
    address: '0x7Af23F9eA698E9b953D2BD70671173AaD0347f19',
    iconSrc: iconSrcs.btcb,
  },
];
