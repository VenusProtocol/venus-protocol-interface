import BigNumber from 'bignumber.js';
import { shortenValueWithSuffix } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

const formatCentsToReadableValue = ({
  value,
  shortenLargeValue = false,
}: {
  value: number | BigNumber | undefined;
  shortenLargeValue?: boolean;
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  const wrappedValueDollars = new BigNumber(value).dividedBy(100).dp(2);

  const formattedValueDollars = shortenLargeValue
    ? shortenValueWithSuffix({
        value: wrappedValueDollars,
        outputsDollars: true,
      })
    : wrappedValueDollars.toFormat(2);

  return formattedValueDollars[0] === '-'
    ? // Format negative values to place minus sign before dollar sign
      `-$${formattedValueDollars.substring(1)}`
    : `$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
