import BigNumber from 'bignumber.js';
import { ONE_TRILLION } from 'constants/numbers';
import shortenValueWithSuffix from 'utilities/shortenValueWithSuffix';

export const HEALTH_FACTOR_MAX_VALUE = 100 * ONE_TRILLION;
export const HEALTH_FACTOR_MAX_DECIMALS = 2;

export const formatHealthFactorToReadableValue = ({ value }: { value: number }) => {
  if (value === Number.POSITIVE_INFINITY) {
    return '∞';
  }

  let readableValue: string;

  if (value > HEALTH_FACTOR_MAX_VALUE) {
    readableValue = `${'> '}${shortenValueWithSuffix({
      value: new BigNumber(HEALTH_FACTOR_MAX_VALUE),
      maxDecimalPlaces: HEALTH_FACTOR_MAX_DECIMALS,
    })}`;
  } else {
    readableValue = shortenValueWithSuffix({
      value: new BigNumber(value),
      maxDecimalPlaces: HEALTH_FACTOR_MAX_DECIMALS,
    });
  }

  return readableValue;
};
