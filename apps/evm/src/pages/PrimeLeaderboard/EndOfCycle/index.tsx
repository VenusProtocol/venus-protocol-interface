import { Button, cn } from '@venusprotocol/ui';
import { useState } from 'react';
import ReactCountdown from 'react-countdown';

import { Card, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import { LastCycleSummaryModal } from '../LastCycleSummaryModal';
import { Timer } from './Timer';

export interface EndOfCycleProps {
  endDate?: Date;
  isLoading?: boolean;
  className?: string;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export const EndOfCycle: React.FC<EndOfCycleProps> = ({ endDate, isLoading, className }) => {
  const { t, Trans } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const cardClassName = cn(
    'flex min-h-39 flex-col items-center justify-center gap-1 bg-background px-6 py-3',
    className,
  );

  if (isLoading) {
    return (
      <Card className={cardClassName}>
        <Spinner />
      </Card>
    );
  }

  if (!endDate) {
    return null;
  }

  const deadline = t('primeLeaderboard.endOfCycle.deadline', { date: endDate });

  const renderCard = ({ days, hours, minutes, seconds, completed }: CountdownState) => (
    <Card className={cardClassName}>
      <p className="w-40 text-center text-b1s text-white">
        {t('primeLeaderboard.endOfCycle.title')}
      </p>

      <Timer days={days} hours={hours} minutes={minutes} seconds={seconds} />

      {completed || !accountAddress ? (
        <p className="text-center text-b1r text-light-grey">
          <Trans
            i18nKey="primeLeaderboard.endOfCycle.helperEnded"
            values={{ deadline }}
            components={{ Bold: <span className="text-b1s text-white" /> }}
          />
        </p>
      ) : (
        <p className="text-center text-b1r text-light-grey">
          <Trans
            i18nKey="primeLeaderboard.endOfCycle.helper"
            values={{ deadline }}
            components={{
              Bold: <span className="text-b1s text-white" />,
              SummaryLink: (
                <Button
                  variant="text"
                  onClick={() => setIsSummaryModalOpen(true)}
                  className="h-auto p-0 text-b1s text-blue underline"
                />
              ),
            }}
          />
        </p>
      )}
    </Card>
  );

  return (
    <>
      <ReactCountdown date={endDate} renderer={renderCard} />

      {isSummaryModalOpen && (
        <LastCycleSummaryModal isOpen handleClose={() => setIsSummaryModalOpen(false)} />
      )}
    </>
  );
};
