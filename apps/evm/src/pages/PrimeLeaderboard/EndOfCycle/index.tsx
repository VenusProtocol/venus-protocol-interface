import { cn } from '@venusprotocol/ui';
import ReactCountdown from 'react-countdown';

import { Card } from 'components';
import { useTranslation } from 'libs/translations';

import { Timer } from './Timer';

export interface EndOfCycleProps {
  endDate?: Date;
  className?: string;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const EndOfCycle: React.FC<EndOfCycleProps> = ({ endDate, className }) => {
  const { t, Trans } = useTranslation();

  const deadline = endDate ? t('primeLeaderboard.endOfCycle.deadline', { date: endDate }) : '';

  const renderCard = ({ days, hours, minutes, seconds, completed }: CountdownState) => (
    <Card
      className={cn(
        'flex flex-col items-center gap-1 px-6 py-3',
        !completed && 'bg-background',
        className,
      )}
    >
      <p className={cn('w-40 text-center text-b1s text-white', !completed && 'uppercase')}>
        {t('primeLeaderboard.endOfCycle.title')}
      </p>

      <Timer days={days} hours={hours} minutes={minutes} seconds={seconds} />

      {completed ? (
        <p className="text-center text-b1r text-light-grey">
          {t('primeLeaderboard.endOfCycle.helperEnded', { deadline })}
        </p>
      ) : (
        <p className="text-center text-b1r text-light-grey">
          <Trans
            i18nKey="primeLeaderboard.endOfCycle.helper"
            values={{ deadline }}
            components={{
              bold: <span className="text-b1s text-white" />,
              summaryLink: <span className="text-blue underline" />,
            }}
          />
        </p>
      )}
    </Card>
  );

  if (!endDate) {
    return renderCard({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
  }

  return <ReactCountdown date={endDate} renderer={renderCard} />;
};
