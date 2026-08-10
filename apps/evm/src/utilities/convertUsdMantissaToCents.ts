import BigNumber from 'bignumber.js';

import { COMPOUND_DECIMALS } from 'constants/compoundMantissa';
import convertDollarsToCents from './convertDollarsToCents';

// USD amounts from the API are scaled by 18 decimals.
const convertUsdMantissaToCents = (value: BigNumber.Value) =>
  convertDollarsToCents(new BigNumber(value).shiftedBy(-COMPOUND_DECIMALS));

export default convertUsdMantissaToCents;
