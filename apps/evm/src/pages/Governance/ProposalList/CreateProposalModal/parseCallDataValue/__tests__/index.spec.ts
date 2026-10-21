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

  it('quotes decimals so the encoder can reject them', () => {
    expect(parseCallDataValue('[1.5, 0.001]')).toEqual(['1.5', '0.001']);
  });

  it('quotes exponent notation so the encoder can reject it', () => {
    expect(parseCallDataValue('[1e24]')).toEqual(['1e24']);
  });

  it('quotes a large integer written with a trailing zero decimal', () => {
    expect(parseCallDataValue('[12345678901234567890123.0]')).toEqual([
      '12345678901234567890123.0',
    ]);
  });

  it('does not quote digits that are part of a string', () => {
    expect(parseCallDataValue('["12345678901234567890123"]')).toEqual(['12345678901234567890123']);
  });

  it('does not touch digit runs that look like exponents inside a bare address', () => {
    expect(parseCallDataValue('0x213c446ec11e45b15a6E29C1C1b402B8897f606d')).toBe(
      '0x213c446ec11e45b15a6E29C1C1b402B8897f606d',
    );
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
