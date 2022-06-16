import BigNumber from 'bignumber.js';

import { SMART_CONTRACT_PERCENTAGE_DECIMALS } from 'constants/smartContractPercentageDecimal';

const convertPercentageFromSmartContract = (percentageFromSmartContract: string | BigNumber) =>
  new BigNumber(percentageFromSmartContract)
    .dividedBy(new BigNumber(10).pow(SMART_CONTRACT_PERCENTAGE_DECIMALS))
    // Convert to percentage
    .multipliedBy(100)
    .toNumber();

export default convertPercentageFromSmartContract;
