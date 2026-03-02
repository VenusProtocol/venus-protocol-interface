import { useGetBalanceOf } from 'clients/api';
import { Spinner } from 'components';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Asset, ChainId, Pool } from 'types';

import { tokens } from '@venusprotocol/chains';
import type BigNumber from 'bignumber.js';
import { NULL_ADDRESS } from 'constants/address';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

export interface NativeTokenBalanceWrapperProps {
  asset: Asset;
  pool: Pool;
  children: (props: {
    asset: Asset;
    pool: Pool;
    userTokenWrappedBalanceMantissa?: BigNumber;
    userNativeTokenBalanceMantissa?: BigNumber;
  }) => React.ReactNode;
}

const NativeTokenBalanceWrapper: React.FC<NativeTokenBalanceWrapperProps> = ({
  asset,
  pool,
  children,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();

  const shouldGetUserTokenWrappedBalanceTokens =
    isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped;

  const nativeToken = tokens[chainId as ChainId]?.find(t => t.isNative);
  const shouldGetUserNativeTokenBalance =
    isIntegratedSwapEnabled && !asset.vToken.underlyingToken.isNative && !!nativeToken;

  const {
    data: userNativeTokenBalanceMantissaData,
    isLoading: isUserNativeTokenBalanceMantissaLoading,
  } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: nativeToken,
    },
    {
      enabled: shouldGetUserNativeTokenBalance && !!accountAddress,
    },
  );

  const {
    data: userTokenWrappedBalanceMantissaData,
    isLoading: isUserTokenWrappedBalanceMantissaLoading,
  } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: asset.vToken.underlyingToken.tokenWrapped,
    },
    {
      enabled: shouldGetUserTokenWrappedBalanceTokens && !!accountAddress,
    },
  );

  if (
    !pool ||
    !asset ||
    (shouldGetUserTokenWrappedBalanceTokens && isUserTokenWrappedBalanceMantissaLoading) ||
    (shouldGetUserNativeTokenBalance && isUserNativeTokenBalanceMantissaLoading)
  ) {
    return <Spinner />;
  }

  return (
    <>
      {children({
        asset,
        pool,
        userTokenWrappedBalanceMantissa: userTokenWrappedBalanceMantissaData?.balanceMantissa,
        userNativeTokenBalanceMantissa: userNativeTokenBalanceMantissaData?.balanceMantissa,
      })}
    </>
  );
};

export default NativeTokenBalanceWrapper;
