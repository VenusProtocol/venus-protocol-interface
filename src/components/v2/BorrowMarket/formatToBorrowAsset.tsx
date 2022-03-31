import BigNumber from 'bignumber.js';

import { BorrowAsset } from './types';

// TODO: import return type of contract method
export type TempAssetFromContract = {
  id: string;
  name: string;
  borrowApy: string;
  liquidity: string;
};

const formatToBorrowAsset = (data: TempAssetFromContract): BorrowAsset => ({
  id: data.id,
  name: data.name,
  borrowApyPercentage: +data.borrowApy,
  liquidityCents: new BigNumber(data.liquidity),
});

export default formatToBorrowAsset;
