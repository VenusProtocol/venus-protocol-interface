import { type GetBalanceOfOutput, useGetBalanceOf } from 'clients/api';
import { Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool } from 'types';

import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

export interface NativeTokenBalanceWrapperProps {
  asset: Asset;
  pool: Pool;
  children: (props: {
    asset: Asset;
    pool: Pool;
    userWalletNativeTokenBalanceData?: GetBalanceOfOutput;
  }) => React.ReactNode;
}

const NativeTokenBalanceWrapper: React.FC<NativeTokenBalanceWrapperProps> = ({
  asset,
  pool,
  children,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const { accountAddress } = useAccountAddress();

  const shouldGetUserWalletNativeTokenBalance =
    isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped;

  const { data: userWalletNativeTokenBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: asset.vToken.underlyingToken.tokenWrapped,
    },
    {
      enabled: shouldGetUserWalletNativeTokenBalance,
    },
  );

  if (
    !pool ||
    !asset ||
    (shouldGetUserWalletNativeTokenBalance && !userWalletNativeTokenBalanceData)
  ) {
    return <Spinner />;
  }

  return <>{children({ asset, pool, userWalletNativeTokenBalanceData })}</>;
};

export default NativeTokenBalanceWrapper;
