import BigNumber from 'bignumber.js';
import { formatCommaThousandsPeriodDecimal } from 'utilities';

const format = (bigNumber: BigNumber, dp = 2) =>
  formatCommaThousandsPeriodDecimal(bigNumber.dp(dp, 1).toString(10));

export default format;
