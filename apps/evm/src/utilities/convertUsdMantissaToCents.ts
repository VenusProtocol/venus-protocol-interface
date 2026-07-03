import BigNumber from 'bignumber.js';

import convertDollarsToCents from './convertDollarsToCents';

// USD amounts from the API are scaled by 18 decimals.
const convertUsdMantissaToCents = (value: BigNumber.Value) =>
  convertDollarsToCents(new BigNumber(value).shiftedBy(-18));

export default convertUsdMantissaToCents;
