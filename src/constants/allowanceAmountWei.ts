import BigNumber from 'bignumber.js';

// Default allowance set when approving a token to be used from an account
const ALLOWANCE_AMOUNT_WEI = new BigNumber(2).pow(256).minus(1).toFixed();
export default ALLOWANCE_AMOUNT_WEI;
