import { Spinner } from 'components';
import { routes } from 'constants/routing';
import { Redirect } from 'containers/Redirect';
import { useAccountAddress } from 'libs/wallet';

import { ConnectedDashboard } from './ConnectedDashboard';

export const Dashboard: React.FC = () => {
  const { accountAddress, isAccountPending } = useAccountAddress();

  if (accountAddress) {
    return <ConnectedDashboard />;
  }

  return isAccountPending ? <Spinner /> : <Redirect to={routes.landing.path} />;
};

export default Dashboard;
