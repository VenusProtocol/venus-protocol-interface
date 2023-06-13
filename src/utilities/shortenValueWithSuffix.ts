import BigNumber from 'bignumber.js';

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

export const shortenValueWithSuffix = ({
  value,
  outputsDollars = false,
  showAllDecimals = false,
}: {
  value: BigNumber;
  outputsDollars?: boolean;
  showAllDecimals?: boolean;
}) => {
  const decimals = showAllDecimals ? undefined : 2;

  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    return `${value.dividedBy(ONE_BILLION).toFormat(decimals)}B`;
  }

  if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    return `${value.dividedBy(ONE_MILLION).toFormat(decimals)}M`;
  }

  if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    return `${value.dividedBy(ONE_THOUSAND).toFormat(decimals)}K`;
  }

  if (value.isGreaterThanOrEqualTo(1)) {
    return value.toFormat(decimals);
  }

  if (value.isEqualTo(0) && !outputsDollars) {
    return '0';
  }

  let smallValueDecimals;

  if (!showAllDecimals) {
    smallValueDecimals = outputsDollars ? 2 : 8;
  }

  return value.toFormat(smallValueDecimals);
};

export default shortenValueWithSuffix;
