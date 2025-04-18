import { HEALTH_FACTOR_MAX_VALUE } from 'utilities/formatHealthFactorToReadableValue';
import { formatHealthFactorToReadableValue } from '..';

describe('formatHealthFactorToReadableValue', () => {
  it.each([
    Number.POSITIVE_INFINITY,
    HEALTH_FACTOR_MAX_VALUE + 1,
    12.23123,
    2.912312,
    1.989765,
    0.8738529,
  ])('format health factor to readable value: %s', value => {
    expect(formatHealthFactorToReadableValue({ value })).toMatchSnapshot();
  });
});
