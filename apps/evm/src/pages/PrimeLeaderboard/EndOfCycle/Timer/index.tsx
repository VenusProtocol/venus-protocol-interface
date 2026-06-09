import { Fragment } from 'react';

import { useTranslation } from 'libs/translations';

export interface TimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ days, hours, minutes, seconds }) => {
  const { t } = useTranslation();

  const pad = (value: number) => String(value).padStart(2, '0');

  const segments = [
    { label: t('primeLeaderboard.endOfCycle.days'), value: days },
    { label: t('primeLeaderboard.endOfCycle.hours'), value: hours },
    { label: t('primeLeaderboard.endOfCycle.mins'), value: minutes },
    { label: t('primeLeaderboard.endOfCycle.sec'), value: seconds },
  ];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-between text-center text-b2s text-light-grey">
        {segments.map(segment => (
          <p key={segment.label} className="w-9">
            {segment.label}
          </p>
        ))}
      </div>

      <div className="flex w-full items-center justify-between">
        {segments.map((segment, index) => (
          <Fragment key={segment.label}>
            {index > 0 && <p className="text-p2s text-light-grey">:</p>}

            <p className="w-9 text-center text-p1s text-white">{pad(segment.value)}</p>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
