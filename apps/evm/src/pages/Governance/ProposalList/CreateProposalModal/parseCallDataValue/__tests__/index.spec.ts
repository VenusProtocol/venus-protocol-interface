import { parseCallDataValue } from '..';

describe('parseCallDataValue', () => {
  it('keeps every digit of a large integer inside an array', () => {
    expect(parseCallDataValue('[12345678901234567890123]')).toEqual(['12345678901234567890123']);
  });

  it('keeps every digit of a large integer nested in a tuple', () => {
    expect(parseCallDataValue('[["0xabc", 12345678901234567890123]]')).toEqual([
      ['0xabc', '12345678901234567890123'],
    ]);
  });

  it('leaves integers within the safe range as numbers', () => {
    expect(parseCallDataValue('[1, 2, 9007199254740991]')).toEqual([1, 2, 9007199254740991]);
  });

  it('leaves decimals untouched', () => {
    expect(parseCallDataValue('[1.5, 0.001]')).toEqual([1.5, 0.001]);
  });

  it('does not quote digits that are part of a string', () => {
    expect(parseCallDataValue('["12345678901234567890123"]')).toEqual(['12345678901234567890123']);
  });

  it('does not touch digits inside an address', () => {
    expect(parseCallDataValue('["0xfD5840Cd36d94D7229439859C0112a4185BC0255"]')).toEqual([
      '0xfD5840Cd36d94D7229439859C0112a4185BC0255',
    ]);
  });

  it('keeps a large top-level integer as a string', () => {
    expect(parseCallDataValue('12345678901234567890123')).toBe('12345678901234567890123');
  });

  it('returns a plain string unchanged', () => {
    expect(parseCallDataValue('0xfD5840Cd36d94D7229439859C0112a4185BC0255')).toBe(
      '0xfD5840Cd36d94D7229439859C0112a4185BC0255',
    );
  });

  it('handles booleans', () => {
    expect(parseCallDataValue('[true, false]')).toEqual([true, false]);
  });
});
