import BigNumber from 'bignumber.js';
import {
  formatCommaThousandsPeriodDecimal,
  shortenNumberWithSuffix,
  convertCentsToDollars,
} from 'utilities';
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

  if (!shortenLargeValue) {
    return `$${formatCommaThousandsPeriodDecimal(
      convertCentsToDollars(typeof value === 'number' ? value : value.toNumber()),
    )}`;
  }

  // Shorten value
  const wrappedValueDollars = new BigNumber(value).dividedBy(100);
  const shortenedValue = shortenNumberWithSuffix(wrappedValueDollars);
  return `$${shortenedValue}`;
};

export default formatCentsToReadableValue;
