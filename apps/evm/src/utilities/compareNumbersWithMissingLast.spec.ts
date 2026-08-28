import compareNumbersWithMissingLast from 'utilities/compareNumbersWithMissingLast';

describe('compareNumbersWithMissingLast', () => {
  it.each([
    ['descending', 'desc' as const, [9, 4.5, 1]],
    ['ascending', 'asc' as const, [1, 4.5, 9]],
  ])('sorts finite values %s', (_label, direction, expectedValues) => {
    expect([4.5, 9, 1].sort((a, b) => compareNumbersWithMissingLast(a, b, direction))).toEqual(
      expectedValues,
    );
  });

  it.each([
    ['undefined', undefined],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
  ])('treats %s as missing and sorts it last in both directions', (_label, missingValue) => {
    expect(compareNumbersWithMissingLast(missingValue, 1, 'desc')).toBe(1);
    expect(compareNumbersWithMissingLast(1, missingValue, 'desc')).toBe(-1);
    expect(compareNumbersWithMissingLast(missingValue, 1, 'asc')).toBe(1);
    expect(compareNumbersWithMissingLast(1, missingValue, 'asc')).toBe(-1);
  });

  it('considers two missing values equal', () => {
    expect(compareNumbersWithMissingLast(Number.NaN, undefined, 'desc')).toBe(0);
  });

  it('considers two equal values equal', () => {
    expect(compareNumbersWithMissingLast(4.5, 4.5, 'desc')).toBe(0);
  });
});
