import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';

import { NewPage } from './NewPage';
import { OldPage } from './OldPage';

const Account: React.FC = () => {
  const isNewAccountPageEnabled = useIsFeatureEnabled({ name: 'newAccountPage' });

  return isNewAccountPageEnabled ? <NewPage /> : <OldPage />;
};

export default Account;
