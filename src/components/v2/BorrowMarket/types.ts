import { Asset } from 'types';

export type BorrowAsset = Pick<Asset, 'id' | 'name'> & {
  liquidityCents: Asset['liquidity'];
  borrowApyPercentage: number;
};
