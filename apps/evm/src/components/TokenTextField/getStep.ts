import BigNumber from 'bignumber.js';

// Browsers validate the step attribute with a decimal type limited to 18 significant digits, so a
// step below 1e-18 overflows their check and every non-integer input gets rejected. Tokens with
// more decimals than that fall back to "any", which disables the native check. Precision is still
// enforced in JS, in the onChange handler of TokenTextField.
const MAX_SUPPORTED_STEP_DECIMALS = 18;

export const getStep = ({ decimals }: { decimals: number }) =>
  decimals > MAX_SUPPORTED_STEP_DECIMALS ? 'any' : new BigNumber(1).shiftedBy(-decimals).toFixed();
