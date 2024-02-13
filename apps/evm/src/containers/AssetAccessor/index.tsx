/** @jsxImportSource @emotion/react */
import { useGetPool } from 'clients/api';
import { Spinner } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import useIsTokenActionEnabled from 'hooks/useIsTokenActionEnabled';
import { useAccountAddress } from 'libs/wallet';
import { Asset, Pool, TokenAction, VToken } from 'types';
import { areTokensEqual } from 'utilities';

import DisabledActionNotice from './DisabledActionNotice';

export interface AssetAccessorProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  connectWalletMessage: string;
  action: TokenAction;
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
  connectWalletMessage,
  action,
}) => {
  const { accountAddress } = useAccountAddress();
  const isTokenActionEnabled = useIsTokenActionEnabled({
    action,
    tokenAddress: vToken.underlyingToken.address,
  });

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  if (!isTokenActionEnabled) {
    return <DisabledActionNotice token={vToken.underlyingToken} action={action} />;
  }

  return (
    <ConnectWallet message={connectWalletMessage}>
      {pool && asset ? children({ asset, pool }) : <Spinner />}
    </ConnectWallet>
  );
};

export default AssetAccessor;
