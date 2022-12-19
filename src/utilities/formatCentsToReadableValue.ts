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

  if (!shortenLargeValue) {
    return `$${wrappedValueDollars.toFormat()}`;
  }

  // Shorten value
  const shortenedValue = shortenValueWithSuffix({
    value: wrappedValueDollars,
    outputsDollars: true,
  });

  return `$${shortenedValue}`;
};

export default formatCentsToReadableValue;
