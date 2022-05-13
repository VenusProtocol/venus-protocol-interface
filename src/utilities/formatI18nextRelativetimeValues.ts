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
  vrtConversionEndTime: Date | undefined,
): FormatI18nextRelativetimeValuesReturn => {
  if (vrtConversionEndTime === undefined) {
    return {
      realtiveTimeFormatValues: { count: PLACEHOLDER_KEY },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMissing',
    };
  }
  const MINUTE_IN_MILLISECONDS = 60 * 1000;
  const HOUR_IN_MILLISECONDS = 60 * MINUTE_IN_MILLISECONDS;
  const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS;
  const vestingTimeRemainingMs = vrtConversionEndTime.getTime() - Date.now();
  let relativeTimeValues: FormatI18nextRelativetimeValuesReturn = {
    realtiveTimeFormatValues: { count: Math.floor(vestingTimeRemainingMs / DAY_IN_MILLISECONDS) },
    relativeTimeTranslationKey: 'convertVrt.remainingTimeDays',
  };
  if (vestingTimeRemainingMs < 0) {
    relativeTimeValues = {
      realtiveTimeFormatValues: {
        count: 0,
      },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMinutes',
    };
  } else if (vestingTimeRemainingMs === HOUR_IN_MILLISECONDS) {
    relativeTimeValues = {
      realtiveTimeFormatValues: {
        count: Math.floor(vestingTimeRemainingMs / HOUR_IN_MILLISECONDS),
      },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeHours',
    };
  } else if (vestingTimeRemainingMs < HOUR_IN_MILLISECONDS) {
    relativeTimeValues = {
      realtiveTimeFormatValues: {
        count: Math.floor(vestingTimeRemainingMs / MINUTE_IN_MILLISECONDS),
      },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeMinutes',
    };
  } else if (vestingTimeRemainingMs < DAY_IN_MILLISECONDS) {
    relativeTimeValues = {
      realtiveTimeFormatValues: {
        hours: Math.floor(vestingTimeRemainingMs / HOUR_IN_MILLISECONDS),
        minutes: Math.floor(
          ((vestingTimeRemainingMs % HOUR_IN_MILLISECONDS) / HOUR_IN_MILLISECONDS) * 60,
        ),
      },
      relativeTimeTranslationKey: 'convertVrt.remainingTimeHoursAndMinutes',
    };
  }
  return relativeTimeValues;
};

export default formatI18nextRelativetimeValues;
