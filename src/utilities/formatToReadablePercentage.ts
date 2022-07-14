import BigNumber from 'bignumber.js';
import { formatPercentage } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

const formatToReadablePercentage = (value: number | string | BigNumber | undefined) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  return `${formatPercentage(value)}%`;
};

export default formatToReadablePercentage;
