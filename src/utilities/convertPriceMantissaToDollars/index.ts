import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import { Token } from 'types';

export const convertPriceMantissaToDollars = ({
  priceMantissa,
  token,
}: {
  priceMantissa: BigNumber | string;
  token: Token;
}) => new BigNumber(priceMantissa).dividedBy(new BigNumber(10).pow(36 - token.decimals));
