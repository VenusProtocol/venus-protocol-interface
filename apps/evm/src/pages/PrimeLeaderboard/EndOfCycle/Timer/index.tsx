import { Fragment } from 'react';

import { useTranslation } from 'libs/translations';

import { pad } from './pad';

export interface TimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ days, hours, minutes, seconds }) => {
  const { t } = useTranslation();

  const segments = [
    { label: t('primeLeaderboard.endOfCycle.days'), value: days },
    { label: t('primeLeaderboard.endOfCycle.hours'), value: hours },
    { label: t('primeLeaderboard.endOfCycle.mins'), value: minutes },
    { label: t('primeLeaderboard.endOfCycle.sec'), value: seconds },
  ];

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-between text-center text-b2s text-secondary">
        {segments.map(segment => (
          <p key={segment.label} className="w-9">
            {segment.label}
          </p>
        ))}
      </div>

      <div className="flex w-full items-center justify-between">
        {segments.map((segment, index) => (
          <Fragment key={segment.label}>
            {index > 0 && <p className="text-p2s text-secondary">:</p>}

            <p className="w-9 text-center text-p1s text-primary">{pad(segment.value)}</p>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
