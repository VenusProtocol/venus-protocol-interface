import { useParams } from 'react-router';
import type { Address } from 'viem';

import { routes } from 'constants/routing';
import { Redirect } from 'containers/Redirect';

type RouteParams = {
  poolComptrollerAddress?: Address;
  vTokenAddress?: Address;
};

export const MarketRedirect: React.FC = () => {
  const { poolComptrollerAddress, vTokenAddress } = useParams<RouteParams>();

  if (!poolComptrollerAddress || !vTokenAddress) {
    return undefined;
  }

  const path = routes.market.path
    .replace(':poolComptrollerAddress', poolComptrollerAddress)
    .replace(':vTokenAddress', vTokenAddress);

  return <Redirect to={path} />;
};
