import { useGetLiquidityHub } from 'clients/api';
import { Spinner } from 'components';
import type { LiquidityHub, VhToken } from 'types';

export interface LiquidityHubAccessorProps {
  vhToken: VhToken;
  children: (props: { liquidityHub: LiquidityHub }) => React.ReactNode;
}

const LiquidityHubAccessor: React.FC<LiquidityHubAccessorProps> = ({ vhToken, children }) => {
  const { data: getLiquidityHubData } = useGetLiquidityHub({
    vhTokenAddress: vhToken.address,
  });
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  if (!liquidityHub) {
    return <Spinner />;
  }

  return children({ liquidityHub });
};

export default LiquidityHubAccessor;
