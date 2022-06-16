import BigNumber from 'bignumber.js';

const getBigNumber = (value?: BigNumber | string | number): BigNumber => {
  if (!value) {
    return new BigNumber(0);
  }
  if (BigNumber.isBigNumber(value)) {
    return value;
  }
  return new BigNumber(value);
};

export default getBigNumber;
