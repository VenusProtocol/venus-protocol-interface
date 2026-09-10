import type { Asset } from 'types';
import { Apy, type ApyProps } from '../Apy';

export interface AssetApyProps {
  asset: Asset;
  type: ApyProps['type'];
  showPrimeSimulation?: boolean;
  showPrimeIcon?: boolean;
  showCampaignRewards?: boolean;
  className?: string;
}

export const AssetApy: React.FC<AssetApyProps> = ({
  asset,
  type,
  showPrimeSimulation,
  showPrimeIcon,
  showCampaignRewards,
  className,
}) => {
  const isBorrow = type === 'borrow';

  return (
    <Apy
      type={type}
      token={asset.vToken.underlyingToken}
      baseApyPercentage={isBorrow ? asset.borrowApyPercentage : asset.supplyApyPercentage}
      tokenDistributions={
        isBorrow ? asset.borrowTokenDistributions : asset.supplyTokenDistributions
      }
      pointDistributions={
        isBorrow ? asset.borrowPointDistributions : asset.supplyPointDistributions
      }
      userBalanceTokens={isBorrow ? asset.userBorrowBalanceTokens : asset.userSupplyBalanceTokens}
      isMuted={isBorrow && !asset.isBorrowableByUser}
      showPrimeSimulation={showPrimeSimulation}
      showPrimeIcon={showPrimeIcon}
      showCampaignRewards={showCampaignRewards}
      vTokenAddress={asset.vToken.address}
      className={className}
    />
  );
};
