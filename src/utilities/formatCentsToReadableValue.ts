import BigNumber from 'bignumber.js';
import { shortenValueWithSuffix } from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

const formatCentsToReadableValue = ({
  value,
  shortenLargeValue = false,
  showAllDecimals = false,
}: {
  value: number | BigNumber | undefined;
  shortenLargeValue?: boolean;
  showAllDecimals?: boolean;
}) => {
  if (value === undefined) {
    return PLACEHOLDER_KEY;
  }

  let wrappedValueDollars = new BigNumber(value).dividedBy(100);

  if (!showAllDecimals) {
    wrappedValueDollars = wrappedValueDollars.dp(2);
  }

  const formattedValueDollars = shortenLargeValue
    ? shortenValueWithSuffix({
        value: wrappedValueDollars,
        outputsDollars: true,
        showAllDecimals,
      })
    : wrappedValueDollars.toFormat(showAllDecimals ? undefined : 2);

  return formattedValueDollars[0] === '-'
    ? // Format negative values to place minus sign before dollar sign
      `-$${formattedValueDollars.substring(1)}`
    : `$${formattedValueDollars}`;
};

export default formatCentsToReadableValue;
