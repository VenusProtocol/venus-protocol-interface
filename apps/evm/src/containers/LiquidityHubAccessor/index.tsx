import { useGetLiquidityHub } from 'clients/api';
import { Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { LiquidityHub, VhToken } from 'types';

export interface LiquidityHubAccessorProps {
  vhToken: VhToken;
  children: (props: { liquidityHub: LiquidityHub }) => React.ReactNode;
}

const LiquidityHubAccessor: React.FC<LiquidityHubAccessorProps> = ({ vhToken, children }) => {
  const { accountAddress } = useAccountAddress();

  const { data: getLiquidityHubData } = useGetLiquidityHub({
    vhTokenAddress: vhToken.address,
    accountAddress,
  });
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  if (!liquidityHub) {
    return <Spinner />;
  }

  return children({ liquidityHub });
};

export default LiquidityHubAccessor;
