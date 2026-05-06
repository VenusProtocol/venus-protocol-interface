import type { useTranslation } from 'libs/translations';

export const getCheckpointDescription = ({
  startDate,
  endDate,
  t,
}: {
  t: ReturnType<typeof useTranslation>['t'];
  startDate?: Date;
  endDate?: Date;
}) => {
  if (!startDate && !endDate) {
    return t('vault.timeline.tbd');
  }

  let description = '';

  if (startDate) {
    description += t('vault.timeline.textualWithTime', { date: startDate });
  }

  if (endDate) {
    description += ` - ${t('vault.timeline.textualWithTime', { date: endDate })}`;
  }

  return description;
};
