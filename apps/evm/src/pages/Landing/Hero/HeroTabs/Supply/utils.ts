import BigNumber from 'bignumber.js';
import { BASE_AMOUNT } from '../shared';

export const calcSupplyEarnings = (apy: BigNumber | undefined, base = BASE_AMOUNT, months = 12) => {
  if (!BigNumber.isBigNumber(apy)) return [];

  const apyRate = 1 + apy.shiftedBy(-2).toNumber() / 12;

  return Array.from(Array(months)).reduce((accu, _curr, index) => {
    const month = index + 1;
    const earning = base * apyRate ** month;

    accu.push({
      month,
      cumAmount: earning,
      currAmount: earning - base,
    });

    return accu;
  }, []);
};
