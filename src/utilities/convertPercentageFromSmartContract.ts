import BigNumber from 'bignumber.js';

import { SMART_CONTRACT_PERCENTAGE_DECIMALS } from 'constants/smartContractPercentageDecimal';

export const convertPercentageFromSmartContract = (factor: string | BigNumber) =>
  new BigNumber(factor)
    .dividedBy(new BigNumber(10).pow(SMART_CONTRACT_PERCENTAGE_DECIMALS))
    // Convert to percentage
    .multipliedBy(100)
    .toNumber();
