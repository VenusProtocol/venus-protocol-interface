import PLACEHOLDER_KEY from 'constants/placeholderKey';

import formatPercentageToReadableValue from '..';

describe('utilities/formatPercentageToReadableValue', () => {
  it('should return PLACEHOLDER_KEY when value is undefined', () => {
    const result = formatPercentageToReadableValue(undefined);
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  it('should return formatted value', () => {
    const result = formatPercentageToReadableValue(43.55);
    expect(result).toEqual('43.55%');
  });
});
