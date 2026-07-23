import { useGetLiquidityHub } from 'clients/api';
import { Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { routes } from 'constants/routing';
import { Redirect } from 'containers/Redirect';
import type { LiquidityHub } from 'types';
import type { Address } from 'viem';

export interface LiquidityHubLoaderProps {
  children: (props: {
    liquidityHub: LiquidityHub;
  }) => React.ReactNode;
  vhTokenAddress?: Address;
}

export const LiquidityHubLoader: React.FC<LiquidityHubLoaderProps> = ({
  vhTokenAddress,
  children,
}) => {
  const { data: getLiquidityHubData, isLoading } = useGetLiquidityHub(
    {
      vhTokenAddress: vhTokenAddress || NULL_ADDRESS,
    },
    {
      enabled: !!vhTokenAddress,
    },
  );
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  const isVhTokenAddressInvalid = !isLoading && !liquidityHub;

  // Redirect to home page if params are invalid
  if (isVhTokenAddressInvalid) {
    return <Redirect to={routes.liquidityHubs.path} />;
  }

  if (!liquidityHub) {
    return <Spinner />;
  }

  return <>{children({ liquidityHub })}</>;
};

export default LiquidityHubLoader;
