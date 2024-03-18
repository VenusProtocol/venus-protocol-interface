/** @jsxImportSource @emotion/react */
import { useGetPool } from 'clients/api';
import { Spinner } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool, TokenAction, VToken } from 'types';
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

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  if (!pool || !asset) {
    return <Spinner />;
  }

  if (asset.disabledTokenActions.includes(action)) {
    return <DisabledActionNotice token={vToken.underlyingToken} action={action} />;
  }

  return <ConnectWallet message={connectWalletMessage}>{children({ asset, pool })}</ConnectWallet>;
};

export default AssetAccessor;
