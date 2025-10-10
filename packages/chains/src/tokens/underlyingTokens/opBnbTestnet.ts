import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { Token } from '../../types';
import { bnb } from '../nativeTokens';

export const tokens: Token[] = [
  bnb,
  {
    address: '0xc2931B1fEa69b6D6dA65a50363A8D75d285e4da9',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    address: '0x94680e003861D43C6c0cf18333972312B6956FF1',
    decimals: 18,
    symbol: 'ETH',
    iconSrc: iconSrcs.eth,
  },
  {
    address: '0x8ac9B3801D0a8f5055428ae0bF301CA1Da976855',
    decimals: 18,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    symbol: 'WBNB',
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
    iconSrc: iconSrcs.wbnb,
    tokenWrapped: bnb,
  },
  {
    symbol: 'BTCB',
    decimals: 18,
    address: '0x7Af23F9eA698E9b953D2BD70671173AaD0347f19',
    iconSrc: iconSrcs.btcb,
  },
];
