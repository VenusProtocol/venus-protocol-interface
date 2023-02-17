import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';

const convertFactorFromSmartContract = ({ factor }: { factor: BigNumber }) =>
  new BigNumber(factor).dividedBy(COMPOUND_MANTISSA).dp(2).toNumber();

export default convertFactorFromSmartContract;
