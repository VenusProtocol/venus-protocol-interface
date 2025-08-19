import { shortenValueWithSuffix } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

export const HEALTH_FACTOR_MAX_VALUE = 100;
export const HEALTH_FACTOR_MAX_DECIMALS = 2;

export const formatHealthFactorToReadableValue = ({ value }: { value: number }) => {
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
