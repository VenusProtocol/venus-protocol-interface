import { Token } from 'types';

import luna from 'assets/img/tokens/luna.png';
import ust from 'assets/img/tokens/ust.png';
import TOKEN_ADDRESSES from 'constants/contracts/addresses/tokens.json';

export const DISABLED_TOKENS = [
  {
    id: 'ust',
    symbol: 'UST',
    decimals: 18,
    address: TOKEN_ADDRESSES.ust[97],
    asset: ust,
  } as Token,
  {
    id: 'luna',
    symbol: 'LUNA',
    decimals: 6,
    address: TOKEN_ADDRESSES.luna[97],
    asset: luna,
  } as Token,
];

export const isAssetEnabled = (assetId: string) =>
  !DISABLED_TOKENS.some(disabledToken => disabledToken.id === assetId);
