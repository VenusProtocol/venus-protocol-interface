import { useGetAsset, useGetPool } from 'clients/api';
import { Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { routes } from 'constants/routing';
import { Redirect } from 'containers/Redirect';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool } from 'types';
import type { Address } from 'viem';

export interface MarketLoaderProps {
  children: (props: {
    asset: Asset;
    pool: Pool;
  }) => React.ReactNode;
  poolComptrollerAddress?: Address;
  vTokenAddress?: Address;
}

export const MarketLoader: React.FC<MarketLoaderProps> = ({
  poolComptrollerAddress,
  vTokenAddress,
  children,
}) => {
  const { accountAddress } = useAccountAddress();

  const { data: getAssetData, isLoading: isGetAssetLoading } = useGetAsset({
    vTokenAddress,
    accountAddress,
  });
  const asset = getAssetData?.asset;
  const isVTokenAddressInvalid = !isGetAssetLoading && !asset;

  const { data: getPools } = useGetPool({
    poolComptrollerAddress: poolComptrollerAddress || NULL_ADDRESS,
    accountAddress,
  });
  const pool = getPools?.pool;

  // Redirect to dashboard page if params are invalid
  if (isVTokenAddressInvalid || !poolComptrollerAddress) {
    return <Redirect to={routes.dashboard.path} />;
  }

  if (!asset || !pool) {
    return <Spinner />;
  }

  return <>{children({ asset, pool })}</>;
};

export default MarketLoader;
