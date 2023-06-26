import BigNumber from 'bignumber.js';
import { shortenValueWithSuffix } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

const formatCentsToReadableValue = ({
  value,
  isTokenPrice = false,
}: {
  value: number | BigNumber | undefined;
  isTokenPrice?: boolean;
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  const wrappedValueDollars = new BigNumber(value).dividedBy(100);

  const formattedValueDollars = isTokenPrice
    ? wrappedValueDollars.toFormat()
    : shortenValueWithSuffix({
        value: wrappedValueDollars,
        decimalPlaces: 2,
      });

  return formattedValueDollars[0] === '-'
    ? // Format negative values to place minus sign before dollar sign
      `-$${formattedValueDollars.substring(1)}`
    : `$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
