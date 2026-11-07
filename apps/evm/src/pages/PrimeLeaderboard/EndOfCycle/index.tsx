import { Button, cn } from '@venusprotocol/ui';
import { useState } from 'react';
import ReactCountdown from 'react-countdown';

import { Card, InfoIcon, Spinner } from 'components';
import { useGetPrimeRankLimit } from 'containers/PrimeRank/useGetPrimeRankLimit';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import { LastCycleSummaryModal } from '../LastCycleSummaryModal';
import { Timer } from './Timer';

export interface EndOfCycleProps {
  endDate?: Date;
  lastCycleIndex?: number;
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

export const EndOfCycle: React.FC<EndOfCycleProps> = ({
  endDate,
  lastCycleIndex,
  isLoading,
  className,
}) => {
  const { t, Trans } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const rankLimit = useGetPrimeRankLimit();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const hasLastCycle = lastCycleIndex !== undefined && lastCycleIndex >= 1;

  const cardClassName = cn(
    'relative isolate flex min-h-39 flex-col items-center justify-center gap-1 overflow-hidden border-border-raised bg-transparent px-6 py-3 tabular-nums shadow-popup before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-surface-popup before:backdrop-blur-popup before:backdrop-saturate-[1.2]',
    className,
  );

  if (isLoading) {
    return (
      <Card className={cardClassName}>
        <Spinner />
      </Card>
    );
  }

  const deadline = endDate ? t('primeLeaderboard.endOfCycle.deadline', { date: endDate }) : '';

  const renderCard = ({ days, hours, minutes, seconds, completed }: CountdownState) => {
    let helper: React.ReactNode = (
      <Trans
        i18nKey="primeLeaderboard.endOfCycle.helper"
        values={{ deadline, limit: rankLimit }}
        components={{
          Bold: <span className="text-b1s text-white" />,
          SummaryLink: (
            <Button
              variant="text"
              onClick={() => setIsSummaryModalOpen(true)}
              className="h-auto p-0 text-b1r text-blue underline hover:font-semibold"
            />
          ),
        }}
      />
    );

    if (completed) {
      helper = t('primeLeaderboard.endOfCycle.cycleEnded');
    } else if (!accountAddress || !hasLastCycle) {
      helper = (
        <Trans
          i18nKey="primeLeaderboard.endOfCycle.helperEnded"
          values={{ deadline, limit: rankLimit }}
          components={{ Bold: <span className="text-b1s text-white" /> }}
        />
      );
    }

    return (
      <Card className={cardClassName}>
        <div className="flex w-40 items-center justify-center gap-x-2 text-b1s text-white">
          {t('primeLeaderboard.endOfCycle.title')}
          <InfoIcon tooltip={t('primeLeaderboard.endOfCycle.tooltip', { limit: rankLimit })} />
        </div>

        <Timer days={days} hours={hours} minutes={minutes} seconds={seconds} />

        <p className="text-center text-b1r text-light-grey">{helper}</p>
      </Card>
    );
  };

  return (
    <>
      {endDate ? (
        <ReactCountdown key={endDate.getTime()} date={endDate} renderer={renderCard} />
      ) : (
        // Between cycles the current cycle endpoint returns null, so show the ended state at 00:00:00
        renderCard({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true })
      )}

      {isSummaryModalOpen && (
        <LastCycleSummaryModal
          cycleIndex={lastCycleIndex}
          isOpen
          handleClose={() => setIsSummaryModalOpen(false)}
        />
      )}
    </>
  );
};
