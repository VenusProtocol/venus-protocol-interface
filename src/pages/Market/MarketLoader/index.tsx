/** @jsxImportSource @emotion/react */
import { Spinner } from 'components';
import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { Asset } from 'types';

import { useGetAsset } from 'clients/api';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

export interface MarketLoaderProps {
  children: (props: {
    asset: Asset;
    isIsolatedPoolMarket: boolean;
    poolComptrollerAddress: string;
  }) => React.ReactNode;
  poolComptrollerAddress?: string;
  vTokenAddress?: string;
  isIsolatedPoolMarket?: boolean;
}

export const MarketLoader: React.FC<MarketLoaderProps> = ({
  poolComptrollerAddress,
  vTokenAddress,
  isIsolatedPoolMarket = false,
  children,
}) => {
  const { accountAddress } = useAuth();

  const { data: getAssetData, isLoading: isGetAssetLoading } = useGetAsset({
    vTokenAddress,
    accountAddress,
  });
  const asset = getAssetData?.asset;
  const isVTokenAddressInvalid = !isGetAssetLoading && !asset;

  // Redirect to dashboard page if params are invalid
  if (isVTokenAddressInvalid || !poolComptrollerAddress) {
    return <Navigate to={routes.dashboard.path} />;
  }

  if (!asset) {
    return <Spinner />;
  }

  return <>{children({ asset, isIsolatedPoolMarket, poolComptrollerAddress })}</>;
};

export default MarketLoader;
