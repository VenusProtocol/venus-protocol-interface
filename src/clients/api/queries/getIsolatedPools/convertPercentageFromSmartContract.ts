import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';

const convertPercentageFromSmartContract = ({
  percentageFromSmartContract,
}: {
  percentageFromSmartContract: BigNumber;
}) =>
  new BigNumber(percentageFromSmartContract)
    .dividedBy(COMPOUND_MANTISSA)
    // Convert to percentage
    .multipliedBy(100)
    .toNumber();

export default convertPercentageFromSmartContract;
