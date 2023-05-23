import BigNumber from 'bignumber.js';

const convertDollarsToCents = (value: BigNumber) => new BigNumber(value).times(100);

export default convertDollarsToCents;
