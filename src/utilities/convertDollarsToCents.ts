import BigNumber from 'bignumber.js';

export const convertDollarsToCents = (value: BigNumber) => new BigNumber(value).times(100);
