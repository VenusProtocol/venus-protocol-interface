import { useGetBalanceOf } from 'clients/api';
import { Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool } from 'types';

import type BigNumber from 'bignumber.js';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

export interface NativeTokenBalanceWrapperProps {
  asset: Asset;
  pool: Pool;
  children: (props: {
    asset: Asset;
    pool: Pool;
    userTokenWrappedBalanceMantissa?: BigNumber;
  }) => React.ReactNode;
}

const NativeTokenBalanceWrapper: React.FC<NativeTokenBalanceWrapperProps> = ({
  asset,
  pool,
  children,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const { accountAddress } = useAccountAddress();

  const shouldGetUserTokenWrappedBalanceTokens =
    isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped;

  const {
    data: userTokenWrappedBalanceMantissaData,
    isLoading: isUserTokenWrappedBalanceMantissaLoading,
  } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: asset.vToken.underlyingToken.tokenWrapped,
    },
    {
      enabled: shouldGetUserTokenWrappedBalanceTokens && !!accountAddress,
    },
  );

  if (
    !pool ||
    !asset ||
    (shouldGetUserTokenWrappedBalanceTokens && isUserTokenWrappedBalanceMantissaLoading)
  ) {
    return <Spinner />;
  }

  return (
    <>
      {children({
        asset,
        pool,
        userTokenWrappedBalanceMantissa: userTokenWrappedBalanceMantissaData?.balanceMantissa,
      })}
    </>
  );
};

export default NativeTokenBalanceWrapper;
