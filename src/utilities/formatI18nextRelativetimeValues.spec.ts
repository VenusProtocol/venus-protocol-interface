import formatI18nextRelativetimeValues from './formatI18nextRelativetimeValues';

describe('utilities/formatI18nextRelativetimeValues', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern').setSystemTime(new Date('2026-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('formats relative Time longer than 1 day in days', () => {
    const THREE_DAYS = 1000 * 60 * 60 * 24 * 3.25;

    const value = formatI18nextRelativetimeValues(new Date(Date.now() + THREE_DAYS));
    expect(value).toStrictEqual({
      realtiveTimeFormatValues: { count: 3 },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeDays',
    });
  });

  test('formats relative Time shorter than one day', () => {
    const FOURTEEN_HOURS = 1000 * 60 * 60 * 14;
    const value = formatI18nextRelativetimeValues(new Date(Date.now() + FOURTEEN_HOURS));
    expect(value).toStrictEqual({
      realtiveTimeFormatValues: { hours: 14, minutes: 0 },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeHoursAndMinutes',
    });
  });

  test('formats shorthand value correctly less than 1 hour', () => {
    const FIVE_AND_HALF_MINUTES = 1000 * 60 * 5.5;
    const value = formatI18nextRelativetimeValues(new Date(Date.now() + FIVE_AND_HALF_MINUTES));
    expect(value).toStrictEqual({
      realtiveTimeFormatValues: { count: 5 },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMinutes',
    });
  });

  test('handles past date with 0', () => {
    const value = formatI18nextRelativetimeValues(new Date(Date.now() - 1000));
    expect(value).toStrictEqual({
      realtiveTimeFormatValues: { count: 0 },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMinutes',
    });
  });

  test('handles undefined', () => {
    const value = formatI18nextRelativetimeValues(undefined);
    expect(value).toStrictEqual({
      realtiveTimeFormatValues: { count: '-' },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMissing',
    });
  });
});
