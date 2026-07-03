import { cn } from '@venusprotocol/ui';

import { Spinner } from 'components';
import { EligibilityStatus } from 'containers/PrimeRank/EligibilityStatus';
import { getRankLabels } from 'containers/PrimeRank/getRankLabels';
import type { PrimeRankData } from 'containers/PrimeRank/useGetPrimeRank';

import { ConnectPrompt } from './ConnectPrompt';
import { RankActions } from './RankActions';
import { RankSummary } from './RankSummary';

export interface RankCardProps {
  isUserConnected: boolean;
  onConnect: () => void;
  rankData: PrimeRankData;
  isLoading?: boolean;
  className?: string;
}

export const RankCard: React.FC<RankCardProps> = ({
  isUserConnected,
  onConnect,
  rankData,
  isLoading,
  className,
}) => {
  const cardClassName = cn(
    'flex flex-col gap-y-3 rounded-lg bg-background-active p-4 min-h-[182px] xl:h-58',
    className,
  );

  if (!isUserConnected) {
    return (
      <div className={cn(cardClassName, 'items-center justify-between')}>
        <ConnectPrompt onConnect={onConnect} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn(cardClassName, 'items-center justify-center')}>
        <Spinner />
      </div>
    );
  }

  const { hasStakedXvs, isCandidate, gapXvsTokens } = rankData;

  const { rankLabel, primeScoreLabel } = getRankLabels(rankData);

  return (
    <div className={cn(cardClassName, 'justify-between')}>
      <div>
        <RankSummary rankLabel={rankLabel} primeScoreLabel={primeScoreLabel} />

        <EligibilityStatus
          hasStakedXvs={hasStakedXvs}
          isCandidate={isCandidate}
          gapXvsTokens={gapXvsTokens}
        />
      </div>

      <RankActions />
    </div>
  );
};
