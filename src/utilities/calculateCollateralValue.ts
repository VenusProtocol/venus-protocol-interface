import BigNumber from 'bignumber.js';
import { Asset } from 'types';
import { convertWeiToCoins } from './common';

const calculateCollateralValue = ({ asset, amountWei }: { asset: Asset; amountWei: BigNumber }) => {
  const collateralValue = convertWeiToCoins({ valueWei: amountWei, tokenId: asset.id })
    .times(asset.tokenPrice)
    .times(asset.collateralFactor);
  return collateralValue;
};

export default calculateCollateralValue;
