import BigNumber from 'bignumber.js';

import { SMART_CONTRACT_PERCENTAGE_DECIMALS } from 'constants/smartContractPercentageDecimal';

const DIVIDER = 10 ** SMART_CONTRACT_PERCENTAGE_DECIMALS;

const convertPercentageFromSmartContract = (factor: string | BigNumber) =>
  new BigNumber(factor)
    .dividedBy(DIVIDER)
    // Convert to percentage
    .multipliedBy(100)
    .toNumber();

export default convertPercentageFromSmartContract;
