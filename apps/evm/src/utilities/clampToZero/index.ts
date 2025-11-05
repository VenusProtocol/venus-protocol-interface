import BigNumber from 'bignumber.js';

export const clampToZero = ({ value }: { value: BigNumber }) => BigNumber.max(value, 0);
