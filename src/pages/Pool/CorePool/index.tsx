import { useGetLegacyPoolComptrollerContractAddress } from 'packages/contracts';
import { Navigate } from 'react-router-dom';

import { routes } from 'constants/routing';

import Pool from '..';

const CorePool: React.FC = () => {
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();

  if (!legacyPoolComptrollerContractAddress) {
    return <Navigate to={routes.dashboard.path} />;
  }

  return <Pool poolComptrollerAddress={legacyPoolComptrollerContractAddress} />;
};

export default CorePool;
