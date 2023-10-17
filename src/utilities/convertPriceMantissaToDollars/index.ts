import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import { Token } from 'types';

const convertPriceMantissaToDollars = ({
  priceMantissa,
  token,
}: {
  priceMantissa: BigNumber | string;
  token: Token;
}) => new BigNumber(priceMantissa).dividedBy(10 ** (36 - token.decimals));

export default convertPriceMantissaToDollars;
