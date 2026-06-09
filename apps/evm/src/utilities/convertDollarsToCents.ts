import BigNumber from 'bignumber.js';

const convertDollarsToCents = (value: BigNumber) => new BigNumber(value).shiftedBy(2);

export default convertDollarsToCents;
