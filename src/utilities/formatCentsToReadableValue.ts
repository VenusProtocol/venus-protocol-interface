import BigNumber from 'bignumber.js';
import { shortenNumberWithSuffix } from 'utilities';
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

  const wrappedValueDollars = new BigNumber(value).dividedBy(100);

  if (!shortenLargeValue) {
    return `$${wrappedValueDollars.toFormat()}`;
  }

  // Shorten value
  const shortenedValue = shortenNumberWithSuffix(wrappedValueDollars);
  return `$${shortenedValue}`;
};

export default formatCentsToReadableValue;
