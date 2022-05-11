import PLACEHOLDER_KEY from 'constants/placeholderKey';

type FormatI18nextRelativetimeValuesReturn =
  | {
      relativeTimeTranslationKey: 'convertVrt.remainingTimeHoursAndMinutes';
      realtiveTimeFormatValues: { hours: number; minutes: number };
    }
  | {
      relativeTimeTranslationKey:
        | 'convertVrt.remainingTimeDays'
        | 'convertVrt.remainingTimeHours'
        | 'convertVrt.remainingTimeMinutes';
      realtiveTimeFormatValues: { count: number };
    }
  | {
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMissing';
      realtiveTimeFormatValues: { count: string };
    };
// Don't remove this comment, it allows for translation keys set by this
// function to be collected
// t('convertVrt.remainingTimeDays_one')
// t('convertVrt.remainingTimeDays_other')
// t('convertVrt.remainingTimeHours_one')
// t('convertVrt.remainingTimeHours_other')
// t('convertVrt.remainingTimeHoursAndMinutes')
// t('convertVrt.remainingTimeMinutes')
// t('convertVrt.remainingTimeMissing')
// t('convertVrt.remainingTimeMinutes_other') t('convertVrt.minutes_one')
// t('convertVrt.minutes_other') t('convertVrt.hours_one')
// t('convertVrt.hours_other') t('convertVrt.days_one')
// t('convertVrt.days_other')
const formatI18nextRelativetimeValues = (
  vrtConversionEndTime: string | undefined,
): FormatI18nextRelativetimeValuesReturn => {
  if (vrtConversionEndTime === undefined) {
    return {
      realtiveTimeFormatValues: { count: PLACEHOLDER_KEY },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMissing',
    };
  }
  const MINUTE_IN_MILISECONDS = 60 * 1000;
  const HOUR_IN_MILISECONDS = 60 * MINUTE_IN_MILISECONDS;
  const DAY_IN_MILISECONDS = 24 * HOUR_IN_MILISECONDS;
  const vestingTimeRemainingMs = new Date().getTime() - +vrtConversionEndTime * 1000;
  let relativeTimeValues: FormatI18nextRelativetimeValuesReturn = {
    realtiveTimeFormatValues: { count: Math.floor(vestingTimeRemainingMs / DAY_IN_MILISECONDS) },
    relativeTimeTranslationKey: 'convertVrt.remainingTimeDays',
  };
  if (vestingTimeRemainingMs === HOUR_IN_MILISECONDS) {
    relativeTimeValues = {
      realtiveTimeFormatValues: { count: Math.floor(vestingTimeRemainingMs / HOUR_IN_MILISECONDS) },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeHours',
    };
  } else if (vestingTimeRemainingMs < HOUR_IN_MILISECONDS) {
    relativeTimeValues = {
      realtiveTimeFormatValues: {
        count: Math.floor(vestingTimeRemainingMs / MINUTE_IN_MILISECONDS),
      },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMinutes',
    };
  } else if (vestingTimeRemainingMs < DAY_IN_MILISECONDS) {
    relativeTimeValues = {
      realtiveTimeFormatValues: {
        hours: Math.floor(vestingTimeRemainingMs / HOUR_IN_MILISECONDS),
        minutes: Math.floor(
          ((vestingTimeRemainingMs % HOUR_IN_MILISECONDS) / HOUR_IN_MILISECONDS) * 60,
        ),
      },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeHoursAndMinutes',
    };
  }
  return relativeTimeValues;
};

export default formatI18nextRelativetimeValues;
