import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';

import { shortenValueWithSuffix } from 'utilities';

import { ConnectPrompt } from './ConnectPrompt';
import { EligibilityStatus } from './EligibilityStatus';
import { RankActions } from './RankActions';
import { RankSummary } from './RankSummary';

export interface PrimeRankData {
  hasStakedXvs: boolean;
  isCandidate: boolean;
  isPrime: boolean;
  hasSupplied: boolean;
  rank: number;
  primeScore: number;
  gapXvsTokens: number;
}

export interface RankCardProps {
  isUserConnected: boolean;
  onConnect: () => void;
  rankData: PrimeRankData;
  className?: string;
}

export const RankCard: React.FC<RankCardProps> = ({
  isUserConnected,
  onConnect,
  rankData,
  className,
}) => {
  const cardClassName = cn('flex h-58 flex-col rounded-lg bg-background-active p-4', className);

  if (!isUserConnected) {
    return (
      <div className={cn(cardClassName, 'items-center justify-between')}>
        <ConnectPrompt onConnect={onConnect} />
      </div>
    );
  }

  const { hasStakedXvs, isCandidate, isPrime, hasSupplied, rank, primeScore, gapXvsTokens } =
    rankData;

  const rankLabel = hasStakedXvs ? `#${rank}` : '#-';
  const primeScoreLabel = hasStakedXvs
    ? shortenValueWithSuffix({ value: new BigNumber(primeScore) })
    : '-';

  return (
    <div className={cn(cardClassName, 'justify-between')}>
      <div>
        <RankSummary rankLabel={rankLabel} primeScoreLabel={primeScoreLabel} />

        <EligibilityStatus
          className="mt-2"
          hasStakedXvs={hasStakedXvs}
          isCandidate={isCandidate}
          isPrime={isPrime}
          hasSupplied={hasSupplied}
          gapXvsTokens={gapXvsTokens}
        />
      </div>

      <RankActions />
    </div>
  );
};
