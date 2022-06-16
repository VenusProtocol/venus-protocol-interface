import BigNumber from 'bignumber.js';

const convertCentsToDollars = (value: number) => new BigNumber(value).dividedBy(100).toFixed(2);

export default convertCentsToDollars;
