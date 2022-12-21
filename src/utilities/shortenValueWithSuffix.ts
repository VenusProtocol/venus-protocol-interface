import BigNumber from 'bignumber.js';

const ONE_BILLION = 1000000000;
const ONE_MILLION = 1000000;
const ONE_THOUSAND = 1000;

export const shortenValueWithSuffix = ({
  value,
  outputsDollars = false,
}: {
  value: BigNumber;
  outputsDollars?: boolean;
}) => {
  if (value.isGreaterThanOrEqualTo(ONE_BILLION)) {
    return `${value.dividedBy(ONE_BILLION).toFormat(2)}B`;
  }

  if (value.isGreaterThanOrEqualTo(ONE_MILLION)) {
    return `${value.dividedBy(ONE_MILLION).toFormat(2)}M`;
  }

  if (value.isGreaterThanOrEqualTo(ONE_THOUSAND)) {
    return `${value.dividedBy(ONE_THOUSAND).toFormat(2)}K`;
  }

  if (value.isGreaterThanOrEqualTo(1)) {
    return value.toFormat(2);
  }

  if (value.isEqualTo(0) && !outputsDollars) {
    return '0';
  }

  return value.toFormat(outputsDollars ? 2 : 8);
};

export default shortenValueWithSuffix;
