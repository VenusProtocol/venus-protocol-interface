import { useGetPool } from 'clients/api';
import { Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool, TokenAction, VToken } from 'types';
import { areTokensEqual } from 'utilities';

import DisabledActionNotice from './DisabledActionNotice';

export interface AssetAccessorProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  action: TokenAction;
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
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

  return children({ asset, pool });
};

export default AssetAccessor;
