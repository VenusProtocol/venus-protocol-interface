import { routes } from 'constants/routing';
import { Redirect } from 'containers/Redirect';
import { useGetSpokeMarket } from 'hooks/useGetSpokeMarket';
import type { SpokeAsset, SpokePool } from 'types';
import type { Address } from 'viem';

export interface SpokeMarketLoaderProps {
  children: (props: { spokePool: SpokePool; asset: SpokeAsset }) => React.ReactNode;
  spokePoolComptrollerAddress?: Address;
  spokeVTokenAddress?: Address;
}

export const SpokeMarketLoader: React.FC<SpokeMarketLoaderProps> = ({
  children,
  spokePoolComptrollerAddress,
  spokeVTokenAddress,
}) => {
  const { spokePool, asset } = useGetSpokeMarket({
    spokePoolComptrollerAddress,
    spokeVTokenAddress,
  });

  if (!spokePool || !asset || !asset.isBorrowable) {
    return <Redirect to={routes.spokePools.path} />;
  }

  return <>{children({ spokePool, asset })}</>;
};
